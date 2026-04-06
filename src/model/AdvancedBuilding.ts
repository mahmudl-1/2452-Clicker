import { assert } from "./Assertions";
import type { Building } from "./Building";
import { db } from "./connections";
import type { Game } from "./Game";

export class AdvanceBuilding implements Building{
    readonly name: string;
    readonly description?: string; 
    readonly cost: number;
    readonly game: Game;
    readonly clickPerSecond: number;

    constructor(name: string, description: string, cost: number,game: Game, clickPerSecond: number){
        this.name=name;
        this.description =description;
        this.cost = cost;
        this.game = game; 
        this.clickPerSecond = clickPerSecond;
        this.#checkABuilding();
    }

    game_id():number{
        return this.game.id;
    }

    static async saveAdvanceBuilding(advanceBuilding: AdvanceBuilding): Promise<AdvanceBuilding>{
        let results = await db().query("insert into advancedbuilding(name, description, cost, clicksPerSecond, game_id)  values($1,$2,$3,$4,$5)",
            [advanceBuilding.name,advanceBuilding.description,advanceBuilding.cost,advanceBuilding.clickPerSecond,advanceBuilding.game_id()]
        );
        return advanceBuilding;
    }

    produceClicks(): number {
        this.#checkABuilding();
        return this.clickPerSecond;
    }

    #checkABuilding(){
        assert(this.clickPerSecond === 10, "Advanced building should have exactly 10 click per second.");
        assert(this.name.length > 0, "The name of the building should not be empty.");
        assert(this.cost > 0, "The cost of the building should not be free.");
        if(this.description != null){
            assert(this.description.length > 0, "The description can be empty.");
        }
    }
}