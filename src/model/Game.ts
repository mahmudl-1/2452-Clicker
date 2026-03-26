import { assert } from "./Assertions";
import { NotSuffecientClicksException } from "./Exceptions/NotSuffecientClicksException";
import type { Listener } from "./Listeners";
import type { Upgrade } from "./Upgrade";
import { UpgradeADD } from "./UpgradeADD";
import { UpgradeMULT } from "./UpgradeMULT";
export class Game{
    #totalClicks: number;
    #clickDamage: number;
    #upgradeADD: UpgradeADD;
    #upgradeMULT: UpgradeMULT;
    #gameListeners: Listener[];


    constructor(){
        this.#totalClicks = 0;
        this.#clickDamage = 1;
        this.#upgradeADD = new UpgradeADD("Rolling pin", 20, 10);
        this.#upgradeMULT = new UpgradeMULT("Candy worker", 100, 2);
        this.#gameListeners = new Array<Listener>();
        this.#checkGame();
    }
    get clickDamage(): number{
        return this.#clickDamage;
    }

    #checkGame(){
        assert(this.#totalClicks >= 0, "Total clicks must greater than or equals to zero.");
        assert(this.#clickDamage > 0, "Click damage must be greater than zero.");
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


    buyUpgrade(upgrade: Upgrade): void{
        assert(upgrade !== null, "Upgrade cannot be null");
        let applied = false;
        if(this.#totalClicks >= upgrade.cost){
            this.#clickDamage = upgrade.apply(this);
            applied = true;
            this.#totalClicks -= upgrade.cost;
        }else{
            throw new NotSuffecientClicksException();
        }
        this.#checkGame();
        if(applied){
            this.#notifyAll();
        }
    }

    get TotalClicks(): number{
        return this.#totalClicks;
    }
}