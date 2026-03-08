import { GameController } from "../controller/GameController";

export class GameView{
    gameController: GameController;
    constructor(){
        this.gameController = new GameController();
        this.build();
    }

    build(){
        const app = document.querySelector<HTMLDivElement>("#app")!;

        app.innerHTML = `
        <div class="game">
            <h1>Candy Clicker</h1>
            <img id="candy" src= "/candy.png" width="150" style="cursor:pointer;" />

            <p>Total Clicks: <span id="counter">0</span></p>
        </div>
        `;
        const candy = document.querySelector<HTMLImageElement>("#candy")!;
        candy.addEventListener("click", () => {
            this.gameController.clickCandy();
        });
    }
    
}