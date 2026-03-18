import { assert } from "./Assertions";
import type { Game } from "./Game";
import type { Upgrade } from "./Upgrade";

export class UpgradeADD implements Upgrade{
    name: string;
    cost: number;
    #effect: number;

    constructor(name: string, cost: number, effect: number){
        assert(name.length > 0, "Name for an upgrade given as input should not be empty.");
        assert(cost > 0, "The input for upgrade cost must be greater than zero.");
        assert(effect>0, "The input for effect of an Upgrade must be greater than zero.");
        this.name = name;
        this.cost = cost;
        this.#effect = effect;
        this.#checkUpgradeAdd();
    }
    
    #checkUpgradeAdd(){
        assert(this.name.length > 0, "The name of the upgrade should not be empty.");
        assert(this.cost > 0, "A upgrade cost must be greater than zero.");
        assert(this.#effect > 0, "An effect of an upgrade must be greater than zero.");
    }

    apply(game: Game): void {
        assert(game !== null, "The game being passed as an input should not be null.");
        game.clickDmg = this.#effect;
        this.#checkUpgradeAdd();
    }

}