import {expect, test} from 'vitest';
import{UpgradeMULT} from '../../src/model/UpgradeMULT';
import{Game} from '../../src/model/Game';

test("Can click on the Candy", (): void => {
    let upgrade = new UpgradeMULT("Candy worker", 1, 2);
    let game = new Game();
    let previousClickDmg = game.clickDamage;
    game.click();

    game.buyUpgrade(upgrade);

    expect(game.clickDamage).toBeGreaterThan(previousClickDmg);
});