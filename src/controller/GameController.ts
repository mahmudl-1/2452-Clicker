import { Game } from "../domain/Game";
import type { Upgrade } from "../domain/Upgrade";

export class GameController{
    #game: Game;
    constructor(){
        this.#game = new Game();
    }

    upgradeAdd(): Upgrade{
        return this.#game.upgradeADD;
    }

    upgradeMult(): Upgrade{
        return this.#game.upgradeMULT;
    }

    clickCandy(){
        this.#game.click();
    }

    clickUpgrade(upgrade: Upgrade){
        return this.#game.buyUpgrade(upgrade);
    }

    view(): number{
        return this.#game.TotalClicks;
    }
}