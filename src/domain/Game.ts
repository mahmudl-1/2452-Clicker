import type { Upgrade } from "./Upgrade";
import { UpgradeADD } from "./UpgradeADD";
import { UpgradeMULT } from "./UpgradeMULT";
export class Game{
    private totalClicks: number;
    private clickDamage: number;
    private allUpgrades: Upgrade[];
    private purchasedUpgrades: Upgrade[];

    constructor(){
        this.totalClicks = 0;
        this.clickDamage = 1;
        this.allUpgrades = [new UpgradeADD("Rolling pin", 5, 10), new UpgradeMULT("Candy worker", 20, 2)];
        this.purchasedUpgrades = [];
    }

    click(): void{
        this.totalClicks += this.clickDamage;
    }

    get availableUpgrades(): Upgrade[]{
        return this.allUpgrades;
    }


    buyUpgrade(Upgrade: Upgrade): boolean{
        let alreadyPurchased = false;
        for(let i: number = 0; i < this.purchasedUpgrades.length; i++){
            if(Upgrade.name === this.purchasedUpgrades[i].name){
                alreadyPurchased = true;
            }
        }
        if(alreadyPurchased === false){
            this.purchasedUpgrades.push(Upgrade);
            Upgrade.apply(this);
        }
        return alreadyPurchased;
    }

    set clickDmg(effect: number){
        if(effect < 0){
            this.clickDamage *= (-1*effect);
        }else{
            this.clickDamage += effect;
        }
    }

    get TotalClicks(): number{
        return this.totalClicks;
    }
}