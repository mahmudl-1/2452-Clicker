import "./style.css"
import { GameController } from "./controller/GameController";
//Changes since the feedback Phase 1
//Upgrades return a value of clickdamage which the game
//sets upon itself
//User can buy multiple upgrades, the restriction for buying only one upgrade has been removed
//using exceptions to communicate user error instead of boolean
//click damage increased only renders when the change has happened.

//entry point
function main(){
    //3. initializing the controller
    new GameController();
}


main();