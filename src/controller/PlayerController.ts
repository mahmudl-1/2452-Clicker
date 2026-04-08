import { AdvanceBuilding } from "../model/AdvancedBuilding";
import { BasicBuilding } from "../model/BasicBuilding";
import { db } from "../model/Connections";
import { InvalidPasswordException } from "../model/Exceptions/InvalidPasswordException";
import { InvalidUsernameException } from "../model/Exceptions/InvalidUsernameException";
import { Game } from "../model/Game";
import { Player } from "../model/Player";
import { UpgradeADD } from "../model/UpgradeADD";
import { UpgradeMULT } from "../model/UpgradeMULT";
import { PlayerView } from "../view/PlayerView";
import { GameController } from "./GameController";

//player controller the main controller that oversees the player authentication and persisting
export class PlayerController{
    #player?: Player;
    #playerView?: PlayerView;
    #gameController?: GameController;

    constructor(){
        this.#playerView = new PlayerView(this);
    }

    //create new account
    async addPlayer(name: string, pass: string){
        const allPlayers = await Player.getAllPlayers();
        const player = allPlayers.find(p => p.username === name); //checking if player exist

        if(!player){
            this.#player = new Player(name,pass);
            const catalog = await Game.getStoreCatalog(this.#player.game); //loading in catalog
            this.#player.game.populateStore(catalog);
            this.#save();
            this.#startAutoSave(); // autosaves every 10 second using setInterval
            this.#playerView = undefined;
            this.#gameController = new GameController(this.#player.game);
        }else{
            throw new accountExistAlready();
        }
    }

    #startAutoSave() { //autosaves the game every 10 seconds
        setInterval(async () => {
            if (this.#player) {
               await this.#save();
            }
        }, 10000); 
    }

    //saves the game by removing the old inventory then saving the current one
    async #save() {
        const game = this.#player!.game;
        if(game.id === 0){
            await Player.savePlayer(this.#player!);
        }
        await Game.saveGame(game);

        await db().query("delete from basicbuilding where game_id = $1", [game.id]);
        await db().query("delete from advancedbuilding where game_id = $1", [game.id]);
        await db().query("delete from upgradeadd where game_id = $1", [game.id]);
        await db().query("delete from upgrademult where game_id = $1", [game.id]);

        for (const item of game.Inventory) {
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
    }
    

    //existing log in
    async existingPlayer(name: string, pass: string){
        const allPlayers = await Player.getAllPlayers();
        const player = allPlayers.find(p => p.username === name);

        if(pass.length <= 5){
            throw new InvalidPasswordException();
        }else if(name.trim() === "" || pass.trim() === ""){
            throw new InvalidUsernameException();
        }
    
        if (player) { //seeing if account exist
            const isValid = await player.validatePass(pass); //validating password
            if (isValid) {
                this.#player = player;
                await player.loadSavedGame(); //loading in the saved state of the player

                const catalog = await Game.getStoreCatalog(this.#player.game);
                this.#player.game.populateStore(catalog);

                if (this.#playerView) { //after loading the player connecting the player view as listener and forcefully notifying to clear view
                    this.#player.registerListener(this.#playerView);
                    this.#player.forcedNotify();
                }
    
                this.#gameController = new GameController(this.#player.game); //loading game view
                this.#startAutoSave();
            } else {
                throw new wrongPassword();
            }
        }else{
            throw new noAccountExist();
        }
    }

    get player(): Player{
        return this.#player!;
    }

}


//exceptions
export class noAccountExist extends Error{

}

export class wrongPassword extends Error{

}

export class accountExistAlready extends Error{

}
