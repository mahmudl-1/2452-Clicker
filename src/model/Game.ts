import { AdvanceBuilding } from "./AdvancedBuilding";
import { assert } from "./Assertions";
import { BasicBuilding } from "./BasicBuilding";
import type { Building } from "./Building";
import { db } from "./connections";
import { NotSuffecientClicksException } from "./Exceptions/NotSuffecientClicksException";
import type { Listener } from "./Listeners";
import type { Player } from "./Player";
import type { Purchasable } from "./Purchasable";
import type { Upgrade } from "./Upgrade";
import { UpgradeADD } from "./UpgradeADD";
import { UpgradeMULT } from "./UpgradeMULT";
/*The main class that holds the candy information like the total clicks
    the click damage and all the upgrades and buildings purchasable
    It is also responsible for managing the listener pattern notifying the view.*/
export class Game{
    #id: number; // phase 2
    #totalClicks: number;
    #clickDamage: number;
    #upgradeADD: UpgradeADD[];
    #upgradeMULT: UpgradeMULT[];
    #basicBuilding: BasicBuilding;
    #advancedBuilding: AdvanceBuilding;
    #gameListeners: Listener[];
    //updated for storing each upgrade in the inventory
    #inventory: Purchasable[];
    #player: Player;

    constructor(player: Player){
        this.#id = 0;//phase 2
        this.#totalClicks = 0;
        this.#clickDamage = 1;
        this.#upgradeADD = new Array(new UpgradeADD("Rolling pin", 50, 10,this,"Ancient bakers swore by this. It might look simple, but its the secret to perfectly thin, crispy candies. +10 clicks"));
        this.#upgradeMULT = new Array(new UpgradeMULT("Candy worker", 200, 2,this,"Trained in the art of rapid confectionery, this worker doubles your manual effort with professional precision."));
        this.#basicBuilding = new BasicBuilding("Candy store","The bells are chiming and the shelves are stocked! A constant stream of customers means a steady flow of clicks every second. +1 autoClick", 300, this);
        this.#advancedBuilding = new AdvanceBuilding("Candy Factory","A massive industrial complex dedicated to high-speed confectionery production. Steam-powered vats and conveyor belts ensure the sugar never stops moving. +10 autoClicks", 500, this);
        this.#gameListeners = new Array<Listener>();
        this.#inventory = new Array<Purchasable>();
        this.#player = player;
        this.#checkGame();
    }

    playerName(): string{
        return this.#player.username;
    }

    set id(num: number){
        this.#id = num;
    }

    get id(): number{
        return this.#id;
    }
    static async saveGame(game: Game): Promise<Game>{
        let results = await db().query<{id:number}>("insert into game(id, totalClicks, clickDamage, player_username) values(default, $1, $2,$3) returning id",
            [game.TotalClicks,game.clickDamage,game.playerName()]
        );
        if (results.rows.length > 0) {
            // Grab the 'id' from the first row returned by RETURNING id
            game.id = results.rows[0].id;
        }
        return game;
    }

    get basicBuilding(): Building{
        return this.#basicBuilding;
    }

    get advancedBuilding(): Building{
        return this.#advancedBuilding;
    }

    get Inventory(): Purchasable[]{
        return this.#inventory;
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

    get upgradeADD(): Upgrade[]{
        return this.#upgradeADD;
    }

    get upgradeMULT(): Upgrade[]{
        return this.#upgradeMULT;
    }

    /*This method takes an upgrade as an input and uses it to change the total clicks
        of the user by the Effect of the upgrade. If the user has suffecient total clicks
        this method can apply the upgrade otherwise does nothing.
        After applying the upgrade it notifies all listeners(view) that change has taken place
        input: Upgrade, the upgrade that was clicked */
    buyPurchasable(purchasable: Purchasable): void{
        let applied = false;
        if(this.#totalClicks >= purchasable.cost ){
            if(purchasable instanceof UpgradeADD || purchasable instanceof UpgradeMULT){
                this.#clickDamage = purchasable.apply(this);
                this.#totalClicks -= purchasable.cost;
                //Updated to register every upgrade in the inventory
                this.#inventory.push(purchasable);
                applied = true;
            }else{
                this.#inventory.push(purchasable);
                this.#totalClicks -= purchasable.cost;
                applied = true;
            }
        }else{
            throw new NotSuffecientClicksException();
        }
        this.#checkGame();
        if(applied){
            this.#notifyAll();
        }
    }

    autoClickTick(){
        this.#inventory.forEach((inven) => {
            if(inven instanceof BasicBuilding|| inven instanceof AdvanceBuilding){
                this.#totalClicks += inven.produceClicks();
            }
        });
        this.#notifyAll();
    }

    get TotalClicks(): number{
        return this.#totalClicks;
    }
}