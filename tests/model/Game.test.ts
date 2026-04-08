import {expect, test} from 'vitest';
import{Game} from '../../src/model/Game';
import { Player } from '../../src/model/Player';
import { UpgradeMULT } from '../../src/model/UpgradeMULT';

test("Can click on the Candy",async (): Promise<void> => {
    let player = new Player("Bot", "123456");
    let game = player.game;
    const val = await Game.getStoreCatalog(game);
    game.populateStore(val);
    let previousClicks = game.TotalClicks;

    game.click();
    game.TotalClicks = 100;
    game.clickDamage = 100;
    expect(game.TotalClicks).toBeGreaterThan(previousClicks);
});

test("Game saves and loads successfully", async (): Promise<void> => {
    let player = new Player("Bot", "123456");
    let game = player.game;

    await Player.savePlayer(player);

    const val = await Game.getStoreCatalog(game);
    game.populateStore(val);

    game.click();
    const basicBuilding = game.basicBuilding[0];
    const advancedBuilding = game.advancedBuilding[0];
    const inventory = game.Inventory;
    
    const savedGame = await Game.saveGame(game);
    game.click();
    const loadGame = Game.loadGame(player);
    const savedGame2 = await Game.saveGame(game);
    expect(savedGame.TotalClicks).toBeGreaterThan(0);
    expect((await loadGame).TotalClicks).toBeLessThan(2);
    expect(savedGame2.TotalClicks).equals(2);
});

test("Autoclick adds the correct amount of clicks based on buildings", async (): Promise<void> => {
    const player = new Player("Bot", "123456");
    const game = player.game;
    
    const catalog = await Game.getStoreCatalog(game);
    game.populateStore(catalog);
    
    const building = game.basicBuilding[0]; 
    game.TotalClicks = 10000;
    game.buyPurchasable(building);
    const building2 = game.advancedBuilding[0];
    game.buyPurchasable(building2);
    
    const initialClicks = game.TotalClicks;
    let expectedProduction = building.produceClicks();
    expectedProduction += building2.produceClicks();

    game.autoClickTick();

    // 5. Assert
    expect(game.TotalClicks).toBe(initialClicks + expectedProduction);
});


test("Clicking Upgrade buys and upgrades the clicks", async (): Promise<void> => {
    const player = new Player("Bot", "123456");
    const game = player.game;
    
    const catalog = await Game.getStoreCatalog(game);
    game.populateStore(catalog);
    
    const previousClickDmg = game.clickDamage;

    
    const totalCostNeeded = game.upgradeMULT[0].cost + game.upgradeADD[0].cost;
    if(game.upgradeMULT[0] instanceof UpgradeMULT){
        let constant = game.upgradeMULT[0].game_id();
    }
    for (let i = 0; i < totalCostNeeded; i++) {
        game.click();
    }

    game.buyPurchasable(game.upgradeADD[0]);
    game.buyPurchasable(game.upgradeMULT[0]);

    
    expect(game.clickDamage).toBeGreaterThan(previousClickDmg);
});


test("Game notify listeners", (): void => {
    let player = new Player("Bot", "123456");
    let game = player.game;
    let notified = false;
    game.registerListener({notify: () => notified = true});
    game.click();
    expect(notified).equals(true);
});

