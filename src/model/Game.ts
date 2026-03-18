import { assert } from "./Assertions";
import type { Listener } from "./Listeners";
import type { Upgrade } from "./Upgrade";
import { UpgradeADD } from "./UpgradeADD";
import { UpgradeMULT } from "./UpgradeMULT";
export class Game{
    #totalClicks: number;
    #clickDamage: number;
    #upgradeADD: UpgradeADD;
    #upgradeMULT: UpgradeMULT;
    #purchasedUpgrades: Upgrade[];
    #gameListeners: Listener[];


    constructor(){
        this.#totalClicks = 0;
        this.#clickDamage = 1;
        this.#upgradeADD = new UpgradeADD("Rolling pin", 20, 10);
        this.#upgradeMULT = new UpgradeMULT("Candy worker", 100, 2);
        this.#purchasedUpgrades = [];
        this.#gameListeners = new Array<Listener>();
        this.#checkGame();
    }

    #checkGame(){
        assert(this.#totalClicks >= 0, "Total clicks must greater than or equals to zero.");
        assert(this.#clickDamage > 0, "Click damage must be greater than zero.");
        const names = this.#purchasedUpgrades.map(u => u.name);
        const unique = new Set(names);
        assert(names.length === unique.size, "Upgrades cannot be purchased twice.");
    }

    //8. register the view for listening for update.
    registerListener(listener: Listener): void{
        assert(listener !== null, "Listener cannot be null");
        this.#gameListeners.push(listener);
    }

    #notifyAll():void{
        this.#gameListeners.forEach(l => l.notify());
    }

    click(): void{
        this.#totalClicks += this.#clickDamage;
        this.#checkGame();
        this.#notifyAll();
    }

    get upgradeADD(): Upgrade{
        return this.#upgradeADD;
    }

    get upgradeMULT(): Upgrade{
        return this.#upgradeMULT;
    }


    buyUpgrade(upgrade: Upgrade): boolean{
        assert(upgrade !== null, "Upgrade cannot be null");
        let applied = false;
        const alreadyPurchased = this.#purchasedUpgrades.some(up => up.name === upgrade.name);
        if(alreadyPurchased === false){
            if(this.#totalClicks >= upgrade.cost){
                this.#purchasedUpgrades.push(upgrade);
                upgrade.apply(this);
                applied = true;
                this.#totalClicks -= upgrade.cost;
            }
        }
        this.#checkGame();
        if(applied){
            this.#notifyAll();
        }
        return applied;
    }

    set clickDmg(effect: number){
        assert(effect !== 0, "The effect to apply cannot be zero");
        if(effect < 0){
            this.#clickDamage *= (-1*effect);
            this.#checkGame();
        }else{
            this.#clickDamage += effect;
            this.#checkGame();
        }
        this.#checkGame();
        this.#notifyAll();
    }

    get TotalClicks(): number{
        return this.#totalClicks;
    }
}