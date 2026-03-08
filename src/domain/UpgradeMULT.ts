import type { Game } from "./game";
import type { Upgrade } from "./Upgrade";

export class UpgradeMULT implements Upgrade{
    name: string;
    cost: number;
    private multFactor: number;

    constructor(name: string, cost: number, multFactor: number){
        this.name = name;
        this.cost = cost;
        this.multFactor = multFactor;
    }
    
    apply(game: Game): void {
        if(this.multFactor < 0){
            game.clickDmg = this.multFactor;
        }else{
            game.clickDmg = (-1*this.multFactor);
        }
    }
}