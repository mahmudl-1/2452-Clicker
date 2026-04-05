import { Game } from "../model/Game";
import { Player } from "../model/Player";
import { UpgradeADD } from "../model/UpgradeADD";
import { PlayerView } from "../view/PlayerView";
import { GameController } from "./GameController";
import { UpgradeMULT } from "../model/UpgradeMULT";
import { BasicBuilding } from "../model/BasicBuilding";
import { AdvanceBuilding } from "../model/AdvancedBuilding";

export class PlayerController{
    #player?: Player;
    #playerView?: PlayerView;
    #gameController?: GameController;

    constructor(){
        this.#playerView = new PlayerView(this);
    }

    //create new account
    addPlayer(name: string, pass: string){
        this.#player = new Player(name,pass);
        this.#save();
        this.#playerView = undefined;
        this.#gameController = new GameController(this.#player.game);
    }

    async #save() {
    const game = this.#player!.game;

    await Player.savePlayer(this.#player!);
    await Game.saveGame(game);

    for (const up of game.upgradeADD) {
        if (up instanceof UpgradeADD) await UpgradeADD.saveUpgradeADD(up);
    }

    for (const up of game.upgradeMULT) {
        if (up instanceof UpgradeMULT) await UpgradeMULT.saveUpgradeMULT(up);
    }

    if (game.basicBuilding instanceof BasicBuilding) {
        await BasicBuilding.saveBasicBuilding(game.basicBuilding);
    }

    if (game.advancedBuilding instanceof AdvanceBuilding) {
        await AdvanceBuilding.saveAdvanceBuilding(game.advancedBuilding);
    }
}
    //existing
    existingPlayer(name: string, pass: string){
        Player.getAllPlayers().then((allPlayers) => {
            const player = allPlayers.find(p => p.username === name && p.validatePass(pass))
            if (player) {
                this.#player = player;
            
                if (this.#playerView) {
                    this.#player.registerListener(this.#playerView);
                    this.#player.forcedNotify();
                }
            
                this.#gameController = new GameController(this.#player.game);
            } else {
                console.error("Login failed: Invalid username or password.");
            }
       });
    }

    get player(): Player{
        return this.#player!;
    }
}