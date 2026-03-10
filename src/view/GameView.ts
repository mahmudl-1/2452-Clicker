import { GameController } from "../controller/GameController";

export class GameView{
    #gameController: GameController;
    constructor(){
        this.#gameController = new GameController();
        this.buildCandy();
    }

    buildCandy(){
        const app = document.querySelector<HTMLDivElement>("#app")!;

        app.innerHTML = `
        <div class="game">
            <h1>Candy Clicker</h1>
            <img id="candy" src= "/candy.png" width="150" style="cursor:pointer;" />

            <p>Total Clicks: <span id="counter"></span></p>
        </div>
        `;
        const counter = document.querySelector<HTMLSpanElement>("#counter")!;
        counter.textContent = this.#gameController.view + "";

        const candy = document.querySelector<HTMLImageElement>("#candy")!;
        candy.addEventListener("click", () => {
            this.#gameController.clickCandy();
            counter.textContent = this.#gameController.view + "";
        });
    }

    updateCounter(){
        
    }
    
}