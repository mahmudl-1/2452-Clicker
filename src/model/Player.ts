import { assert } from "./Assertions";
import { db } from "./connections";
import { InvalidPasswordException } from "./Exceptions/InvalidPasswordException";
import { InvalidUsernameException } from "./Exceptions/InvalidUsernameException";
import { Game } from "./Game";
import type { Listener } from "./Listeners";

export class Player{
    readonly #username: string;
    #password: string;
    #game: Game;
    #playerListeners: Listener[];

    constructor(username: string, password: string){
        if(username.length == 0){
            throw new InvalidUsernameException();
        }
        if(password.length <= 5){
            throw new InvalidPasswordException();
        }
        this.#username = username;
        this.#password = password;
        this.#game = new Game(this);
        this.#playerListeners = new Array<Listener>();
        this.#notifyAll();
        this.#checkPlayer();
    }

    static async getAllPlayers(): Promise<Array<Player>>{
        const allPlayers = new Array<Player>();

        let results = await db()
            .query<{name: string, password: string}>("select * from player");

        results.rows.forEach((row) =>{
            allPlayers.push(new Player(row.name, row.password));
        });

        return allPlayers;
    }   

    static async savePlayer(player: Player): Promise<Player>{
        let results = await db().query("insert into player(username, password) values($1,$2)",
            [player.username, player.password]
        );
        return player;
    }

    validatePass(pass: string): boolean{
        return this.#password === pass;
    }

    registerListener(listener: Listener): void{
        assert(listener != null, "Listener cannot be null");
        this.#playerListeners.push(listener);
    }

    #notifyAll():void{
        this.#playerListeners.forEach(l => l.notify());
    }

    forcedNotify(){
        this.#notifyAll();
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

    get password(): string{
        return this.#password;
    }
}