import type { GameController } from "../controller/GameController";
import type { Game } from "../model/Game";
import type { Listener } from "../model/Listeners";
import type { Upgrade } from "../model/Upgrade";
export class GameView implements Listener{
    #game: Game;
    #gameController: GameController;
    constructor(game: Game, gameController: GameController){
        this.#game = game;

        //6.Binding the view and the domain together
        this.#game.registerListener(this);

        //7.Using GameController to issue command
        this.#gameController = gameController;

        this.buildCandy();
        this.buildUpgrades();
    }

    notify(){
        //rerendering the view for our Candy game
        this.#updateUI();
    }

    #updateUI(){
        const counter = document.querySelector("#counter")!;
        counter.textContent = String(this.#game.TotalClicks);
    }

    //9. Setting up the view for the objects I'm clicking
    buildCandy(){
        const app = document.querySelector<HTMLDivElement>("#app")!;

        app.innerHTML = `
            <div class="game" id="candyGame">

                <div class="leftSide">
                    <h1 id="gameName">Candy Clicker</h1>

                    <img id="candy" src="/candy.png" width="150" style="cursor:pointer;" />

                    <p id="totalClick">
                        Total Clicks: <strong id="counter"></strong>
                    </p>
                </div>

                <div class="rightSide" id="upgradeSection">
                    <h2>Upgrades</h2>
                    <p id="message" style="color: red; font-weight: bold; height: 24px;"></p>
                </div>

            </div>
    `;
        this.#updateUI(); //initializing for zero

        //10. Connecting the view and controller with method calls
        const candy = document.querySelector<HTMLImageElement>("#candy")!;
        candy.addEventListener("click", () => {
            this.#gameController.candyClicked();
        });
    }

    buildUpgrades(){
        const upgradeSection = document.querySelector<HTMLDivElement>("#upgradeSection")!;
        const upgrades: Upgrade[]= this.#gameController.getUpgrades();
        let index = 0;
        upgrades.forEach((up: Upgrade) =>{
            const button = document.createElement("button");
            button.id = "button"+String(index);
            index++;
            button.textContent = `${up.name}  (Cost: ${up.cost} clicks)`;

            button.addEventListener("click", () => {
                const messageBox = document.querySelector<HTMLParagraphElement>("#message")!;
                try{
                    this.#gameController.upgradeClick(up);
                    messageBox.style.color = "green";
                    messageBox.textContent = "Click damage increased"
                    setTimeout(()=>{
                        messageBox.textContent = "";
                    }, 1000);
                }catch(e:any){
                    messageBox.style.color = "red";
                    messageBox.textContent = "Insuffecient clicks!";
                    setTimeout(()=>{
                        messageBox.textContent = "";
                    }, 1000);
                }
            });
            upgradeSection.appendChild(button);
        });
    
    }
}