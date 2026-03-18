import { assert } from "./Assertions";
import type { Game } from "./Game";
import type { Upgrade } from "./Upgrade";

export class UpgradeMULT implements Upgrade{
    name: string;
    cost: number;
    #multFactor: number;

    constructor(name: string, cost: number, multFactor: number){
        assert(name.length > 0, "Name for an upgrade given as input should not be empty.");
        assert(cost > 0, "The input for upgrade cost must be greater than zero.");
        assert(multFactor > 1 || multFactor < -1, "The input absolute value for multiply factor of an Upgrade must be greater than one.");
        this.name = name;
        this.cost = cost;
        this.#multFactor = multFactor;
        this.#checkUpgradeMult();
    }
    
    #checkUpgradeMult(){
        assert(this.name.length > 0, "The name of the upgrade should not be empty.");
        assert(this.cost > 0, "A upgrade cost must be greater than zero.");
        assert(this.#multFactor > 1 || this.#multFactor < -1, "An absolute multiply factor for an upgrade must be greater than one.");
    }

    apply(game: Game): void {
        assert(game !== null, "The game being passed as an input should not be null.");
        if(this.#multFactor < 0){
            game.clickDmg = this.#multFactor;
            this.#checkUpgradeMult();
        }else{
            game.clickDmg = (-1*this.#multFactor);
            this.#checkUpgradeMult();
        }
    }
}