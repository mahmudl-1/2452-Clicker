import { assert } from "./Assertions";
import { db } from "./Connections";
import { InvalidPasswordException } from "./Exceptions/InvalidPasswordException";
import { InvalidUsernameException } from "./Exceptions/InvalidUsernameException";
import { Game } from "./Game";
import type { Listener } from "./Listeners";

//The hash function to convert to PBKDF2 from normal string using a salt and using webcrypto library
const encoder = new TextEncoder();

async function hashPassword(password: string, salt: string): Promise<string> {
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"],
  );

  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: encoder.encode(salt),
      iterations: 10000,
      hash: "SHA-256",
    },
    passwordKey,
    256,
  );

  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

//account for each players
export class Player {
  readonly #username: string;
  #password: string;
  #game: Game;
  #playerListeners: Listener[];

  constructor(username: string, password: string) {
    if (username.length === 0) {
      throw new InvalidUsernameException();
    }
    if (password.length <= 5) {
      throw new InvalidPasswordException();
    }
    this.#username = username;
    this.#password = password;
    this.#game = new Game(this);
    this.#playerListeners = new Array<Listener>();
    this.#notifyAll();
    this.#checkPlayer();
  }

  //helper for loading the game into the player without the setter basically a setter
  async loadSavedGame() {
    this.#game = await Game.loadGame(this);
  }

  //gets all the players in the db
  static async getAllPlayers(): Promise<Array<Player>> {
    const allPlayers = new Array<Player>();

    let results = await db().query<{ username: string; password: string }>(
      "select * from player",
    );

    results.rows.forEach((row) => {
      allPlayers.push(new Player(row.username, row.password));
    });

    return allPlayers;
  }

  //save the player to db
  static async savePlayer(player: Player): Promise<Player> {
    const salt = crypto.randomUUID();
    const hashedPassword = await hashPassword(player.password, salt);

    let results = await db().query(
      "insert into player(username, password, salt) values($1,$2,$3) on conflict do nothing",
      [player.username, hashedPassword, salt],
    );
    return player;
  }

  //Takes a input pass as input and hashes it and checks it with the stored hash to check if they are equal
  async validatePass(pass: string): Promise<boolean> {
    let valid = false;
    const results = await db().query<{ password: string; salt: string }>(
      "select password, salt from player where username = $1",
      [this.#username],
    );

    if (results.rows.length !== 0) {
      const storedHash = results.rows[0].password;
      const storedSalt = results.rows[0].salt;

      const inputHash = await hashPassword(pass, storedSalt);

      if (inputHash === storedHash) valid = true;
    }
    return valid;
  }

  registerListener(listener: Listener): void {
    assert(listener != null, "Listener cannot be null");
    this.#playerListeners.push(listener);
  }

  //notifies the view to clear itself
  #notifyAll(): void {
    this.#playerListeners.forEach((l) => l.notify());
  }

  //forcefully notified
  forcedNotify() {
    this.#notifyAll();
  }

  #checkPlayer() {
    assert(this.#username.length > 0, "A username cannot be empty.");
    assert(
      this.#password.length > 5,
      "A password has to be more than 5 characters long.",
    );
  }

  get game(): Game {
    return this.#game;
  }

  get username(): string {
    return this.#username;
  }

  get password(): string {
    return this.#password;
  }
}
