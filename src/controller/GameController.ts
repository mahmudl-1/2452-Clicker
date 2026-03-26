import { NotSuffecientClicksException } from "../model/Exceptions/NotSuffecientClicksException";
import { Game } from "../model/Game";
import type { Upgrade } from "../model/Upgrade";
import { GameView } from "../view/GameView";

export class GameController{
    #game: Game;
    #gameView: GameView;

    //4. initialize internal state.
    //5. initialize the view for the internal state (the game)
    constructor(){
        this.#game = new Game();
        this.#gameView = new GameView(this.#game, this);
    }

    //11. Button clicked so letting domain know to change
    candyClicked(): void{
        this.#game.click();
    }

    getUpgrades(): Upgrade[]{
        const upgrades: Upgrade[] = [this.#game.upgradeADD, this.#game.upgradeMULT];
        return upgrades;
    }

    upgradeClick(up: Upgrade): void{
        try{
            this.#game.buyUpgrade(up);
        }catch(e: any){
            if(e instanceof NotSuffecientClicksException){
                throw new NotSuffecientClicksException();
            }
        }
    }
}