import { GameController } from "../controller/GameController";
import type { Upgrade } from "../model/Upgrade";
export class GameView{
    #gameController: GameController;
    constructor(){
        this.#gameController = new GameController();
        this.buildCandy();
        this.buildUpgrades();
    }

    buildCandy(){
        const app = document.querySelector<HTMLDivElement>("#app")!;

        app.innerHTML = `
            <div class="game" id="candyGame">

                <div class="leftSide">
                    <h1 id="gameName">Candy Clicker</h1>

                    <img id="candy" src="/candy.png" width="150" style="cursor:pointer;" />

                    <p id="totalClick">
                        Total Clicks: <span id="counter"></span>
                    </p>
                </div>

                <div class="rightSide" id="upgradeSection">
                    <h2>Upgrades</h2>
                </div>

            </div>
    `;
        const counter = document.querySelector<HTMLSpanElement>("#counter")!;
        counter.textContent = this.#gameController.view() + "";

        const candy = document.querySelector<HTMLImageElement>("#candy")!;
        candy.addEventListener("click", () => {
            this.#gameController.clickCandy();
            counter.textContent = this.#gameController.view() + "";
        });
    }

    buildUpgrades(){
        const upgradeSection = document.querySelector<HTMLDivElement>("#upgradeSection")!;
        const upgrades = [this.#gameController.upgradeAdd(), this.#gameController.upgradeMult()];
        
        upgrades.forEach((up: Upgrade) =>{
            const button = document.createElement("button");

            button.textContent = `${up.name}  (${up.cost})`;

            button.addEventListener("click", () => {
                const purchased = this.#gameController.clickUpgrade(up);

                if(purchased){
                    button.disabled = true;
                }
                const counter = document.querySelector<HTMLSpanElement>("#counter")!;
                counter.textContent = this.#gameController.view() + "";
            });
            upgradeSection.appendChild(button);
        });
    
    }
}