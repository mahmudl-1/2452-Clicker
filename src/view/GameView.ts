import type { GameController } from "../controller/GameController";
import type { Building } from "../model/Building";
import type { Game } from "../model/Game";
import type { Listener } from "../model/Listeners";
import type { Upgrade } from "../model/Upgrade";

//This is the view of the Game which has task of setting up the candy and the upgrades on the screen
//and letting the user know of any change or recieve inputs
export class GameView implements Listener{
    #game: Game;
    #gameController: GameController;
    #currentMessage: string = ""; //feedback message box
    #messageColour: string = ""; // the colours of the text

    constructor(game: Game, gameController: GameController){
        this.#game = game;

        //6.Binding the view and the domain together
        this.#game.registerListener(this);

        //7.Using GameController to issue command
        this.#gameController = gameController;

        this.buildCandy();
        this.buildUpgrades();
        this.buildBuildings();
    }

    //render
    notify(){
        //rerendering the view for our Candy game
        this.#updateUI();
    }

    //when notified automatically render the click count and the feedback message
    #updateUI(){
        const counter = document.querySelector("#counter")!;
        counter.textContent = String(this.#game.TotalClicks);

        const messageBox = document.querySelector<HTMLParagraphElement>("#message");
        if(messageBox){
            messageBox.textContent = this.#currentMessage;
            messageBox.style.color = this.#messageColour;
        }
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

                <div class="rightSide" id="StoreSection">
                    <div id= "upgradeSection">
                        <h2>Upgrades</h2>
                    </div>

                    <div id="buildingSection" style="margin-top: 20px;">
                        <h2>Buildings</h2>
                    </div>
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
        upgrades.forEach((up: Upgrade, index: number) =>{
            const button = document.createElement("button");
            button.id = "upButton"+ String(index);
            
            //Button styling
            button.style.display = "block";
            button.style.width = "100%"; 
            button.style.textAlign = "left"; 
            button.style.marginBottom = "10px";
            button.style.padding = "8px 12px"; 
            button.style.cursor = "pointer"; 
            button.style.borderRadius = "6px"; 
            button.style.border = "1px solid #ccc";

            let descriptionText = "";
            if(up.description !== ""){
                descriptionText = `<br><span style="font-size: 0.85em; color: #555;"><i>${up.description}</i></span>`;
            }
            
            button.innerHTML = `<strong>${up.name}</strong> (Cost: ${up.cost} clicks) ${descriptionText}`;

            button.addEventListener("click", () => {
                //changed to catch error and render the message on change
                try{
                    this.#currentMessage = `${up.name} purchased!`;
                    this.#messageColour = "green";
                    this.#gameController.purchasableClicked(up);

                    setTimeout(()=>{
                        this.#currentMessage = "";
                        this.#updateUI();
                    }, 1000);
                }catch(e:any){
                    this.#currentMessage = "Insuffecient Clicks!";
                    this.#messageColour = "red";
                    this.#updateUI();
                    setTimeout(()=>{
                        this.#currentMessage = "";
                        this.#updateUI();
                    }, 1000);
                }
            });
            upgradeSection.appendChild(button);
        });
    
    }

    buildBuildings(){
        const buildingSection = document.querySelector<HTMLDivElement>("#buildingSection")!;
        const buildings: Building[] = this.#gameController.getBuildings();

        buildings.forEach((building: Building, index: number) =>{
            const button = document.createElement("button");
            button.id = "buildButton" + String(index);

            //button styling
            button.style.display = "block";
            button.style.width = "100%";
            button.style.textAlign = "left";
            button.style.marginBottom = "10px";
            button.style.padding = "8px 12px";
            button.style.cursor = "pointer";
            button.style.borderRadius = "6px";
            button.style.border = "1px solid #ccc";

            let descriptionText = "";
            if (building.description !== "") {
                descriptionText = `<br><span style="font-size: 0.85em; color: #555;"><i>${building.description}</i></span>`;
            }

            button.innerHTML = `<strong>${building.name}</strong> (+${building.clickPerSecond} CPS | Cost: ${building.cost}) ${descriptionText}`;

            button.addEventListener("click", () =>{
                try{
                    this.#currentMessage = `${building.name} purchased!`;
                    this.#messageColour = "green";
                    this.#gameController.purchasableClicked(building);

                    setTimeout(()=>{
                        this.#currentMessage = "";
                        this.#updateUI();
                    }, 1000);
                }catch(e: any){
                    this.#currentMessage = "Insufficient Clicks!";
                    this.#messageColour = "red";
                    this.#updateUI();
                    setTimeout(() => {
                        this.#currentMessage = "";
                        this.#updateUI();
                    },1000);
                }
            });
            buildingSection.appendChild(button);
        });
    }
}