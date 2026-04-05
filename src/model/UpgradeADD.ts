import { assert } from "./Assertions";
import type { Game } from "./Game";
import type { Upgrade } from "./Upgrade";

//Upgrade add this class holds the upgrade which has
//the ability to increment the click damage by a constant
export class UpgradeADD implements Upgrade{
    readonly name: string;
    readonly cost: number;
    readonly #effect: number;
    readonly game: Game;
    readonly description?: string;
    

    constructor(name: string, cost: number, effect: number, game: Game, description: string){
        this.name = name;
        this.cost = cost;
        this.#effect = effect;
        this.game = game;
        this.description = description;
        this.#checkUpgradeAdd();
    }

    //pre,post condition check
    #checkUpgradeAdd(){
        assert(this.name.length > 0, "The name of the upgrade should not be empty.");
        assert(this.cost > 0, "A upgrade cost must be greater than zero.");
        assert(this.#effect > 0, "An effect of an upgrade must be greater than zero.");
        if(this.description != null){
            assert(this.description.length > 0, "The description can be empty.");
        }
    }

    //When called takes the value and updates the click damage which then the game class can set upon itself
    apply(game: Game): number {
        assert(game !== null, "The game being passed as an input should not be null.");
        this.#checkUpgradeAdd();
        return game.clickDamage + this.#effect;
    }

}