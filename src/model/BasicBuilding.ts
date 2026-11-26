import { assert } from "./Assertions";
import type { Building } from "./Building";
import { db } from "./Connections";
import type { Game } from "./Game";

//a basic building that autoclicks 1 time per second
export class BasicBuilding implements Building {
  readonly name: string;
  readonly description?: string;
  readonly cost: number;
  readonly game: Game;
  readonly clickPerSecond: number;

  constructor(
    name: string,
    description: string,
    cost: number,
    game: Game,
    clicksPerSecond: number,
  ) {
    this.name = name;
    this.description = description;
    this.cost = cost;
    this.game = game;
    this.clickPerSecond = clicksPerSecond;
    this.#checkBBuilding();
  }

  game_id(): number {
    return this.game.id;
  }

  //saves to db
  static async saveBasicBuilding(
    basicBuilding: BasicBuilding,
  ): Promise<BasicBuilding> {
    await db().query(
      "insert into basicbuilding(name, description, cost, clicksPerSecond, game_id) values($1, $2, $3, $4, $5)",
      [
        basicBuilding.name,
        basicBuilding.description,
        basicBuilding.cost,
        basicBuilding.clickPerSecond,
        basicBuilding.game_id(),
      ],
    );
    return basicBuilding;
  }

  //loads from db to an object
  static async loadBasicBuildings(game: Game): Promise<BasicBuilding[]> {
    const results = await db().query<{
      name: string;
      description: string;
      cost: number;
      clickspersecond: number;
    }>(
      "select name, description, cost, clicksPerSecond from basicbuilding where game_id = $1",
      [game.id],
    );

    return results.rows.map(
      (row) =>
        new BasicBuilding(
          row.name,
          row.description,
          row.cost,
          game,
          row.clickspersecond,
        ),
    );
  }

  //produces a fixed amount of clicks that the game sets upon itself
  produceClicks(): number {
    this.#checkBBuilding();
    return this.clickPerSecond;
  }

  #checkBBuilding() {
    assert(
      this.clickPerSecond === 1,
      "Basic building should have one click per second.",
    );
    assert(
      this.name.length > 0,
      "The name of the building should not be empty.",
    );
    assert(this.cost > 0, "The cost of the building should not be free.");
    if (this.description != null) {
      assert(
        this.description.length > 0,
        "The description should not be empty if provided.",
      );
    }
  }
}
