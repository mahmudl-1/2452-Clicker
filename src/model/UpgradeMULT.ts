import { assert } from "./Assertions";
import { db } from "./Connections";
import type { Game } from "./Game";
import type { Upgrade } from "./Upgrade";

//Upgrade Mult has the ability to increase click damage by
//a multiply factor
export class UpgradeMULT implements Upgrade{
    readonly name: string;
    readonly cost: number;
    readonly #multFactor: number;
    readonly game: Game;
    readonly description?: string;

    constructor(name: string, cost: number, multFactor: number, game: Game, description: string){
        this.name = name;
        this.cost = cost;
        this.#multFactor = multFactor;
        this.game = game;
        this.description = description;
        this.#checkUpgradeMult();
    }

    get multFactor(): number{
        return this.#multFactor;
    }

    game_id(): number{
        return this.game.id;
    }

    //loads from db to an object
    static async loadUpgradeMULTs(game: Game): Promise<UpgradeMULT[]> {
        const results = await db().query<{
            name: string,
            cost: number,
            multfactor: number,
            description: string
        }>(
            "select name, cost, multFactor, description from upgrademult where game_id = $1", 
            [game.id]
        );  

        return results.rows.map(row => 
            new UpgradeMULT(
                row.name, 
                row.cost, 
                row.multfactor, 
                game, 
                row.description
            )
        );
    }
    
    //saves to db
   static async saveUpgradeMULT(upgradeMult: UpgradeMULT): Promise<UpgradeMULT> {
        const query = `
            insert into upgrademult (name, description, cost, multFactor, game_id) 
            values ($1, $2, $3, $4, $5)
        `;
    
        const values = [
            upgradeMult.name, 
            upgradeMult.description, 
            upgradeMult.cost, 
            upgradeMult.multFactor, 
            upgradeMult.game_id()
        ];

        await db().query(query, values);
    
        return upgradeMult;
    }
    
    //pre,post condition
    #checkUpgradeMult(){
        assert(this.name.length > 0, "The name of the upgrade should not be empty.");
        assert(this.cost > 0, "A upgrade cost must be greater than zero.");
        assert(this.#multFactor > 1, "A multiply factor for an upgrade must be greater than one.");
        if(this.description != null){
            assert(this.description.length > 0, "The description can be empty.");
        }
    }

    //When called modifies the click damage by multiplying it with the factor
    //then returns it which is then set by the game
    apply(game: Game): number {
        assert(game !== null, "The game being passed as an input should not be null.");
        this.#checkUpgradeMult();
        return game.clickDamage*this.#multFactor;
    }
}