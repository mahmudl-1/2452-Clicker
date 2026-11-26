import { AdvanceBuilding } from "../model/AdvancedBuilding";
import { BasicBuilding } from "../model/BasicBuilding";
import { db } from "../model/Connections";
import { noAccountExist } from "../model/Exceptions/noAccountExistsException";
import { wrongPassword } from "../model/Exceptions/WrongPassword";
import { accountExistAlready } from "../model/Exceptions/accountExistAlreadyException";
import { Game } from "../model/Game";
import { Player } from "../model/Player";
import { UpgradeADD } from "../model/UpgradeADD";
import { UpgradeMULT } from "../model/UpgradeMULT";
import { PlayerView } from "../view/PlayerView";
import { GameController } from "./GameController";

//player controller the main controller that oversees the player authentication and persisting
export class PlayerController {
  #player?: Player;
  #playerView?: PlayerView;
  #gameController?: GameController;
  #saving = false;
  #savePending = false;
  #saveHooksAdded = false;
  #savedInventoryCount = -1; //how many items the db currently holds, -1 = unknown

  constructor() {
    this.#playerView = new PlayerView(this);
  }

  //create new account
  async addPlayer(name: string, pass: string) {
    const allPlayers = await Player.getAllPlayers();
    const player = allPlayers.find((p) => p.username === name); //checking if player exist

    if (!player) {
      this.#player = new Player(name, pass);
      const catalog = await Game.getStoreCatalog(this.#player.game); //loading in catalog
      this.#player.game.populateStore(catalog);
      await this.#requestSave(); // initial save so the game gets an id
      this.#startSaving();
      this.#playerView = undefined;
      this.#gameController = new GameController(this.#player.game);
    } else {
      throw new accountExistAlready();
    }
  }

  //saves the game by removing the old inventory then saving the current one
  async #save() {
    const game = this.#player!.game;
    //checking if a new save or existing save
    if (game.id === 0) {
      await Player.savePlayer(this.#player!);
    }
    await Game.saveGame(game);

    //copy of the inventory so it can't change while we are writing it
    const inventory = [...game.Inventory];

    //the inventory only changes when something is bought, so the autoclick ticks
    //(every second) only need the click total saved, which saveGame already did.
    //not touching the inventory rows means a refresh can't interrupt a rewrite of them
    if (inventory.length === this.#savedInventoryCount) return;

    //delete and re-insert in one transaction, so a refresh in the middle of a save
    //can never leave the player with the old inventory deleted and nothing saved
    await db().query("begin");
    try {
      //deleting the old inventory
      await db().query("delete from basicbuilding where game_id = $1", [
        game.id,
      ]);
      await db().query("delete from advancedbuilding where game_id = $1", [
        game.id,
      ]);
      await db().query("delete from upgradeadd where game_id = $1", [game.id]);
      await db().query("delete from upgrademult where game_id = $1", [game.id]);

      //saving the new inventory
      for (const item of inventory) {
        if (item instanceof BasicBuilding) {
          await BasicBuilding.saveBasicBuilding(item);
        } else if (item instanceof AdvanceBuilding) {
          await AdvanceBuilding.saveAdvanceBuilding(item);
        } else if (item instanceof UpgradeADD) {
          await UpgradeADD.saveUpgradeADD(item);
        } else if (item instanceof UpgradeMULT) {
          await UpgradeMULT.saveUpgradeMULT(item);
        }
      }
      await db().query("commit");
      this.#savedInventoryCount = inventory.length;
    } catch (e) {
      //undo the half finished save, then let requestSave report it
      await db()
        .query("rollback")
        .catch(() => {});
      throw e;
    }
  }

  //existing log in
  async existingPlayer(name: string, pass: string) {
    const checkUsernamePass = new Player(name, pass);
    const allPlayers = await Player.getAllPlayers();
    const player = allPlayers.find((p) => p.username === name); //checking if the plaayer exists

    if (player) {
      //seeing if account exist
      const isValid = await player.validatePass(pass); //validating password
      if (isValid) {
        this.#player = player;
        await player.loadSavedGame(); //loading in the saved state of the player

        const catalog = await Game.getStoreCatalog(this.#player.game); //loading in game initial state
        this.#player.game.populateStore(catalog);

        if (this.#playerView) {
          //after loading the player connecting the player view as listener and forcefully notifying to clear view
          this.#player.registerListener(this.#playerView);
          this.#player.forcedNotify(); //forcefully telling the view to clear itself
        }

        this.#gameController = new GameController(this.#player.game); //loading game view
        this.#savedInventoryCount = this.#player.game.Inventory.length; //db already matches what was loaded
        this.#startSaving(); //saves on every change and when the tab closes
      } else {
        throw new wrongPassword();
      }
    } else {
      throw new noAccountExist();
    }
  }

  //saves one at a time; if changes arrive mid-save, runs once more afterwards
  async #requestSave() {
    if (!this.#player) return;
    if (this.#saving) {
      this.#savePending = true;
      return;
    }
    this.#saving = true;
    try {
      do {
        this.#savePending = false;
        await this.#save();
      } while (this.#savePending);
    } catch (e) {
      console.error("Save failed", e);
    } finally {
      this.#saving = false;
    }
  }

  //save on every game change, and when the tab is closed or hidden
  #startSaving() {
    this.#player!.game.registerListener({
      notify: () => {
        this.#requestSave();
      },
    });

    if (this.#saveHooksAdded) return;
    this.#saveHooksAdded = true;

    window.addEventListener("pagehide", () => {
      this.#requestSave();
    });
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") this.#requestSave();
    });
  }

  get player(): Player {
    return this.#player!;
  }
}
