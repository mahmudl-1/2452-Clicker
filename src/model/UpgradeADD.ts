import { query } from "@electric-sql/pglite/template";
import { assert } from "./Assertions";
import { db } from "./Connections";
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

    get effect(): number{
        return this.#effect;
    }

    game_id(): number{
        return this.game.id;
    }

    //loads from db to an object
    static async loadUpgradeADDs(game: Game): Promise<UpgradeADD[]> {
        const results = await db().query<{
            name: string,
            cost: number,
            effect: number,
            description: string
        }>(
            "select name, cost, effect, description from upgradeadd where game_id = $1", 
            [game.id]
        );

        return results.rows.map(row => 
            new UpgradeADD(
                row.name, 
                row.cost, 
                row.effect, 
                game, 
                row.description
            )
        );
    }

    //saves the object to the db
    static async saveUpgradeADD(upgradeADD: UpgradeADD): Promise<UpgradeADD>{
        let results = await db().query("insert into upgradeadd(name, description, cost, effect, game_id) values($1,$2,$3, $4, $5)",
            [upgradeADD.name,upgradeADD.description,upgradeADD.cost,upgradeADD.effect, upgradeADD.game_id()]
        );
        return upgradeADD;
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