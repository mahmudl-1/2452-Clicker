import { assert } from "./Assertions";
import type { Game } from "./Game";
import type { Upgrade } from "./Upgrade";

export class UpgradeMULT implements Upgrade{
    name: string;
    cost: number;
    #multFactor: number;

    constructor(name: string, cost: number, multFactor: number){
        this.name = name;
        this.cost = cost;
        this.#multFactor = multFactor;
        this.#checkUpgradeMult();
    }
    
    #checkUpgradeMult(){
        assert(this.name.length > 0, "The name of the upgrade should not be empty.")
        assert(this.cost > 0, "A upgrade cost must be greater than zero.")
        assert(this.#multFactor > 1, "An multiply factor for an upgrade must be greater than one.")
    }

    apply(game: Game): void {
        if(this.#multFactor < 0){
            game.clickDmg = this.#multFactor;
            this.#checkUpgradeMult();
        }else{
            game.clickDmg = (-1*this.#multFactor);
            this.#checkUpgradeMult();
        }
    }
}