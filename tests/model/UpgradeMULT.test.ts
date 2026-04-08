import {expect, test} from 'vitest';
import{Game} from '../../src/model/Game';
import { Player } from '../../src/model/Player';
import { UpgradeMULT } from '../../src/model/UpgradeMULT';

test("Can buy an upgrade after clicking enough", async (): Promise<void> => {
    const player = new Player("Bot", "123456");
    const game = player.game;
    
    const catalog = await Game.getStoreCatalog(game);
    game.populateStore(catalog);
    
    const previousClickDmg = game.clickDamage;
    const upgrade = game.upgradeMULT[0];

    
    for (let i = 0; i < upgrade.cost; i++) {
        game.click();
    }

    game.buyPurchasable(upgrade);

    expect(game.clickDamage).toBeGreaterThan(previousClickDmg);
});

test("UpgradeMultFactor is greater than 1", async (): Promise<void> => {
    const player = new Player("Bot", "123456");
    const game = player.game;
    
    const catalog = await Game.getStoreCatalog(game);
    game.populateStore(catalog);
    const upgrade = game.upgradeMULT[0];

    if(upgrade instanceof UpgradeMULT){
        expect(upgrade.multFactor).toBeGreaterThan(1);
    }
});