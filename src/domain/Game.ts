import type { Upgrade } from "./Upgrade";
import { UpgradeADD } from "./UpgradeADD";
import { UpgradeMULT } from "./UpgradeMULT";
export class Game{
    #totalClicks: number;
    #clickDamage: number;
    #allUpgrades: Upgrade[];
    #purchasedUpgrades: Upgrade[];

    constructor(){
        this.#totalClicks = 0;
        this.#clickDamage = 1;
        this.#allUpgrades = [new UpgradeADD("Rolling pin", 20, 10), new UpgradeMULT("Candy worker", 100, 2)];
        this.#purchasedUpgrades = [];
    }

    click(): void{
        this.#totalClicks += this.#clickDamage;
    }

    get availableUpgrades(): Upgrade[]{
        return this.#allUpgrades;
    }


    buyUpgrade(Upgrade: Upgrade): boolean{
        let alreadyPurchased = false;
        let applied = false;
        for(let i: number = 0; i < this.#purchasedUpgrades.length; i++){
            if(Upgrade.name === this.#purchasedUpgrades[i].name){
                alreadyPurchased = true;
            }
        }
        if(alreadyPurchased === false){
            if(this.#totalClicks >= Upgrade.cost){
                this.#purchasedUpgrades.push(Upgrade);
                Upgrade.apply(this);
                applied = true;
                this.#totalClicks -= Upgrade.cost;
            }
        }
        return applied;
    }

    set clickDmg(effect: number){
        if(effect < 0){
            this.#clickDamage *= (-1*effect);
        }else{
            this.#clickDamage += effect;
        }
    }

    get TotalClicks(): number{
        return this.#totalClicks;
    }
}