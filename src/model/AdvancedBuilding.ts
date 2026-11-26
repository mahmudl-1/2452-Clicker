import { assert } from "./Assertions";
import type { Building } from "./Building";
import { db } from "./Connections";
import type { Game } from "./Game";

//an advanced building that autoclicks 10 times per second
export class AdvanceBuilding implements Building {
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
    this.#checkABuilding();
  }

  game_id(): number {
    return this.game.id;
  }

  //saves to db
  static async saveAdvanceBuilding(
    advanceBuilding: AdvanceBuilding,
  ): Promise<AdvanceBuilding> {
    await db().query(
      "insert into advancedbuilding(name, description, cost, clicksPerSecond, game_id) values($1, $2, $3, $4, $5)",
      [
        advanceBuilding.name,
        advanceBuilding.description,
        advanceBuilding.cost,
        advanceBuilding.clickPerSecond,
        advanceBuilding.game_id(),
      ],
    );
    return advanceBuilding;
  }

  //loads from db to an object
  static async loadAdvanceBuildings(game: Game): Promise<AdvanceBuilding[]> {
    const results = await db().query<{
      name: string;
      description: string;
      cost: number;
      clickspersecond: number;
    }>(
      "select name, description, cost, clicksPerSecond from advancedbuilding where game_id = $1",
      [game.id],
    );

    return results.rows.map(
      (row) =>
        new AdvanceBuilding(
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
    this.#checkABuilding();
    return this.clickPerSecond;
  }

  #checkABuilding() {
    assert(
      this.clickPerSecond === 10,
      "Advanced building should have 10 click per second.",
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
