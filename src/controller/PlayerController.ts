import { Player } from "../model/Player";
import { PlayerView } from "../view/PlayerView";
import { GameController } from "./GameController";

export class PlayerController{
    #player?: Player;
    #playerView?: PlayerView;
    #gameController?: GameController;

    constructor(){
        this.#playerView = new PlayerView();
    }

    addPlayer(name: string, pass: string){
        this.#player = new Player(name,pass);
        this.#playerView = undefined;
        this.#gameController = new GameController(this.#player.game);
    }

}