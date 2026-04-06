import type { Building } from "../model/Building";
import { Game } from "../model/Game";
import type { Purchasable } from "../model/Purchasable";
import type { Upgrade } from "../model/Upgrade";
import { GameView } from "../view/GameView";

//The main controller sets up all the instances of the domain and view
export class GameController{
    #game: Game;
    #gameView: GameView;

    //4. initialize internal state.
    //5. initialize the view for the internal state (the game)
    constructor(game: Game){
        this.#game = game;
        this.#gameView = new GameView(this.#game, this);
        setInterval(() => {
            this.#game.autoClickTick();
        },1000);
    }

    //11. Button clicked so letting domain know to change
    //used for incrementing click
    candyClicked(): void{
        this.#game.click();
    }

    //getter for upgrades
    getUpgrades(): Upgrade[]{
        const upgrades: Upgrade[] = [];
        this.#game.upgradeADD.forEach((up) => {upgrades.push(up)});
        this.#game.upgradeMULT.forEach((upg) => {upgrades.push(upg)});
        return upgrades;
    }

    getBuildings(): Building[]{
        const buildings: Building[] = [this.#game.basicBuilding[0], this.#game.advancedBuilding[0]];
        return buildings;
    }

    //buying upgrade
    purchasableClicked(purchasable: Purchasable): void{
        this.#game.buyPurchasable(purchasable);
    }
}