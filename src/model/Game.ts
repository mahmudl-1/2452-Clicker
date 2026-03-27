import { assert } from "./Assertions";
import { NotSuffecientClicksException } from "./Exceptions/NotSuffecientClicksException";
import type { Listener } from "./Listeners";
import type { Upgrade } from "./Upgrade";
import { UpgradeADD } from "./UpgradeADD";
import { UpgradeMULT } from "./UpgradeMULT";
/*The main class that holds the candy information like the total clicks
    the click damage and all the upgrades and buildings purchasable
    It is also responsible for managing the listener pattern notifying the view.*/
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

    // Pre/post Conditions check
    #checkGame(){
        assert(this.#totalClicks >= 0, "Total clicks must greater than or equals to zero.");
        assert(this.#clickDamage > 0, "Click damage must be greater than zero.");
    }

    //8. register the view for listening for update.
    registerListener(listener: Listener): void{
        assert(listener !== null, "Listener cannot be null");
        this.#gameListeners.push(listener);
    }

    //notify the view of the changes
    #notifyAll():void{
        this.#gameListeners.forEach(l => l.notify());
    }

    //This method when invoked increments the total clicks by 1
    //and notifies the view of the change in total clicks
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

    /*This method takes an upgrade as an input and uses it to change the total clicks
        of the user by the Effect of the upgrade. If the user has suffecient total clicks
        this method can apply the upgrade otherwise does nothing.
        After applying the upgrade it notifies all listeners(view) that change has taken place
        input: Upgrade, the upgrade that was clicked */
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