import {expect, test} from 'vitest';
import{Game} from '../../src/model/Game';

test("Can click on the Candy", (): void => {
    let game = new Game();
    let previousClicks = game.TotalClicks;

    game.click();

    expect(game.TotalClicks).toBeGreaterThan(previousClicks);
});

test("Clicking Upgrade buys and upgrades the clicks", (): void =>{
    let game = new Game();
    let previousClickDmg = game.clickDamage;
    for(let i = 0; i < game.upgradeMULT.cost + game.upgradeADD.cost; i++){
        game.click();
    }
    game.buyUpgrade(game.upgradeADD);
    game.buyUpgrade(game.upgradeMULT);
    expect(game.clickDamage).toBeGreaterThan(previousClickDmg);
});


test("Game notify listeners", (): void => {
    let game = new Game();
    let notified = false;
    game.registerListener({notify: () => notified = true});
    game.click();
    expect(notified).equals(true);
});

