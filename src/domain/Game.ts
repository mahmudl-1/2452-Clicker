import { assert } from "./Assertions";
import type { Upgrade } from "./Upgrade";
import { UpgradeADD } from "./UpgradeADD";
import { UpgradeMULT } from "./UpgradeMULT";
export class Game{
    #totalClicks: number;
    #clickDamage: number;
    #upgradeADD: UpgradeADD;
    #upgradeMULT: UpgradeMULT;
    #purchasedUpgrades: Upgrade[];

    constructor(){
        this.#totalClicks = 0;
        this.#clickDamage = 1;
        this.#upgradeADD = new UpgradeADD("Rolling pin", 20, 10);
        this.#upgradeMULT = new UpgradeMULT("Candy worker", 100, 2);
        this.#purchasedUpgrades = [];
        this.#checkGame();
    }

    #checkGame(){
        assert(this.#totalClicks >= 0, "Total clicks must greater than or equals to zero.");
        assert(this.#clickDamage > 0, "Click damage must be greater than zero.");
        let duplicate = false;
        const unique = new Set(this.#purchasedUpgrades);
        for(const item of this.#purchasedUpgrades){
            let count = 0;
            for(const prod of unique){
                if(prod.name === item.name){
                    count++;
                }
            }
            if(count > 1){
                duplicate = true;
            }
        }
        assert(!duplicate, "Upgrades cannot be purchased twice.")
    }

    click(): void{
        this.#totalClicks += this.#clickDamage;
        this.#checkGame();
    }

    get upgradeADD(): Upgrade{
        return this.#upgradeADD;
    }

    get upgradeMULT(): Upgrade{
        return this.#upgradeMULT;
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
        this.#checkGame();
        return applied;
    }

    set clickDmg(effect: number){
        if(effect < 0){
            this.#clickDamage *= (-1*effect);
            this.#checkGame();
        }else{
            this.#clickDamage += effect;
            this.#checkGame();
        }
    }

    get TotalClicks(): number{
        return this.#totalClicks;
    }
}