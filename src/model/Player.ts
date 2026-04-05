import { assert } from "./Assertions";
import { InvalidPasswordException } from "./Exceptions/InvalidPasswordException";
import { InvalidUsernameException } from "./Exceptions/InvalidUsernameException";
import { Game } from "./Game";

export class Player{
    readonly #username: string;
    #password: string;
    #game: Game;

    constructor(username: string, password: string){
        if(username.length == 0){
            throw new InvalidUsernameException();
        }
        if(password.length <= 5){
            throw new InvalidPasswordException();
        }
        this.#username = username;
        this.#password = password;
        this.#game = new Game();
        this.#checkPlayer();
    }

    #checkPlayer(){
        assert(this.#username.length > 0, "A username cannot be empty.");
        assert(this.#password.length > 5, "A password has to be more than 5 characters long.");
    }

    get game(): Game{
        return this.#game;
    }

    get username(): string{
        return this.#username;
    }
}