import { AdvanceBuilding } from "./AdvancedBuilding";
import { assert } from "./Assertions";
import { BasicBuilding } from "./BasicBuilding";
import type { Building } from "./Building";
import { db } from "./Connections";
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
    #basicBuilding: BasicBuilding[];
    #advancedBuilding: AdvanceBuilding[];
    #gameListeners: Listener[];
    //updated for storing each upgrade in the inventory
    #inventory: Purchasable[];
    #player: Player;

    constructor(player: Player){
        this.#id = 0;//phase 2
        this.#totalClicks = 0;
        this.#clickDamage = 1;
        this.#upgradeADD = [];
        this.#upgradeMULT = [];
        this.#basicBuilding = [];
        this.#advancedBuilding = [];
        this.#gameListeners = new Array<Listener>();
        this.#inventory = new Array<Purchasable>();
        this.#player = player;
        this.#checkGame();
    }


    //gets the whole store catalog
    static async getStoreCatalog(game: Game): Promise<Purchasable[]>{
        const results = await db().query<{
            name: string,
            item_type: string,  
            description: string, 
            cost: number, 
            effect_value: number 
        }>("select *from catalog");

        const storeItems: Purchasable[] = [];

        results.rows.forEach(row => {
            if(row.item_type === "UpgradeADD"){
                storeItems.push(new UpgradeADD(row.name, row.cost, row.effect_value, game,row.description));
            }else if(row.item_type === "UpgradeMULT"){
                storeItems.push(new UpgradeMULT(row.name, row.cost, row.effect_value, game,row.description));
            }else if(row.item_type === "BasicBuilding"){
                storeItems.push(new BasicBuilding(row.name,row.description,row.cost,game,row.effect_value));
            }else if(row.item_type === "AdvanceBuilding"){
                storeItems.push(new AdvanceBuilding(row.name,row.description,row.cost,game,row.effect_value));
            }
        });
        return storeItems;
    }

    set TotalClicks(num: number){
        this.#totalClicks = num;
    }

    set clickDamage(dmg: number){
        this.#clickDamage = dmg;
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

    //populates the game with the catalog
    populateStore(catalog: Purchasable[]){
        catalog.forEach((pur) =>{
            if(pur instanceof UpgradeADD){
                this.upgradeADD.push(pur);
            }else if(pur instanceof UpgradeMULT){
                this.upgradeMULT.push(pur);
            }else if(pur instanceof BasicBuilding){
                this.#basicBuilding.push(pur);
            }else if(pur instanceof AdvanceBuilding){
                this.#advancedBuilding.push(pur);
            }
        });
    }

    //saves the game into db
    static async saveGame(game: Game): Promise<Game>{
        if(game.id === 0){
            let results = await db().query<{id:number}>("insert into game(id, totalClicks, clickDamage, player_username) values(default, $1, $2,$3) returning id",
                [game.TotalClicks,game.clickDamage,game.playerName()]
            );
            if (results.rows.length > 0) {
                game.id = results.rows[0].id;
            }
        }else{
            await db().query(
                "update game set totalClicks = $1, clickDamage = $2 where id = $3",
                [game.TotalClicks, game.clickDamage, game.id]
            );
        }
        return game;
    }

    //loads the game state of a player and turns into an object
    static async loadGame(player: Player): Promise<Game>{
        let username = player.username;
        const results = await db().query<{ id: number, totalclicks: number, clickdamage: number }>("select *from game where player_username = $1",
            [username]
        );

        const loadedGame = new Game(player);

        if(results.rows.length>0){
            const row = results.rows[0];
            loadedGame.id = row.id;
            loadedGame.TotalClicks = row.totalclicks;
            loadedGame.clickDamage = row.clickdamage;

            //for the autoclicking to resume
            (await AdvanceBuilding.loadAdvanceBuildings(loadedGame)).forEach((ab) => loadedGame.Inventory.push(ab));
            (await BasicBuilding.loadBasicBuildings(loadedGame)).forEach((bb) => {loadedGame.Inventory.push(bb)});
            (await UpgradeADD.loadUpgradeADDs(loadedGame)).forEach((ua) => {loadedGame.Inventory.push(ua)});
            (await UpgradeMULT.loadUpgradeMULTs(loadedGame)).forEach((um) => {loadedGame.Inventory.push(um)});

        }
        return loadedGame;
    }

    get basicBuilding(): Building[]{
        return this.#basicBuilding;
    }

    get advancedBuilding(): Building[]{
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
                this.#checkGame();
                //Updated to register every upgrade in the inventory
                this.#inventory.push(purchasable);
                applied = true;
            }else{
                this.#inventory.push(purchasable);
                this.#totalClicks -= purchasable.cost;
                this.#checkGame();
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

    //autoclick by checking the inventory for all the buildings using set interval in the controller
    autoClickTick(){
        this.#inventory.forEach((inven) => {
            if(inven instanceof BasicBuilding|| inven instanceof AdvanceBuilding){
                this.#totalClicks += inven.produceClicks();
                this.#checkGame()
            }
        });
        this.#notifyAll();
    }

    get TotalClicks(): number{
        return this.#totalClicks;
    }
}