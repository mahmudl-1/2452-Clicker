import "./style.css"
import { PlayerController } from "./controller/PlayerController";
import ddl from '../create-tables.sql?raw'
import { db } from "./model/Connections";
//Changes since the feedback Phase 1
//Upgrades return a value of clickdamage which the game
//sets upon itself
//User can buy multiple upgrades, the restriction for buying only one upgrade has been removed
//using exceptions to communicate user error instead of boolean
//click damage increased only renders when the change has happened.

//entry point
function main(){
    
    //load the table into the database
    db().exec(ddl);

    //1. Starting the player signin view
    new PlayerController();
}


main();