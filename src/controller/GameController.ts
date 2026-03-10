import { Game } from "../domain/Game";

export class GameController{
    #game: Game;
    constructor(){
        this.#game = new Game();
    }

    clickCandy(){
        this.#game.click();
    }

    clickUpgradeADD(){
        this.#game.buyUpgrade(this.#game.availableUpgrades[0]);
    }

    clickUpgradeMULT(){
        this.#game.buyUpgrade(this.#game.availableUpgrades[1]);
    }

    get view(): number{
        return this.#game.TotalClicks;
    }
}