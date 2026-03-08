import type { Game } from "./game";
import type { Upgrade } from "./Upgrade";

export class UpgradeADD implements Upgrade{
    name: string;
    cost: number;
    private effect: number;

    constructor(name: string, cost: number, effect: number){
        this.name = name;
        this.cost = cost;
        this.effect = effect;
    }
    
    apply(game: Game): void {
        game.clickDmg = this.effect;
    }


}