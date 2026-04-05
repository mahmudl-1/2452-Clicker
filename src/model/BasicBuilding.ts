import { assert } from "./Assertions";
import type { Building } from "./Building";
import type { Game } from "./Game";

export class BasicBuilding implements Building{
    readonly name: string;
    readonly description?: string;
    readonly cost: number;
    readonly game: Game;
    readonly clickPerSecond: number;

    constructor(name: string, description:string, cost:number,game:Game){
        this.name = name;
        this.description = description;
        this.cost = cost;
        this.game = game;
        this.clickPerSecond = 1;
        this.#checkBBuilding();
    }

    produceClicks(): number {
        this.#checkBBuilding();
        return this.clickPerSecond;
    }

    #checkBBuilding(){
        assert(this.clickPerSecond === 1, "Basic building should have only one click per second.");
        assert(this.name.length > 0, "The name of the building should not be empty.");
        assert(this.cost > 0, "The cost of the building should not be free.");
        if(this.description != null){
            assert(this.description.length > 0, "The description can be empty.");
        }
    }
}