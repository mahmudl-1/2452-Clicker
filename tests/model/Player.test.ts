import {expect, test} from 'vitest';
import{Game} from '../../src/model/Game';
import { Player } from '../../src/model/Player';


test("getAllPlayers retrieves all users from the database", async (): Promise<void> => {
    const p1 = new Player("User1", "1235656");
    const p2 = new Player("User2", "458585");
    await Player.savePlayer(p1);
    await Player.savePlayer(p2);

    const players = await Player.getAllPlayers();

    expect(players.length).toBeGreaterThanOrEqual(2);
    
    const usernames = players.map(p => p.username);
    expect(usernames).toContain("User1");
    expect(usernames).toContain("User2");
    expect(players[0]).toBeInstanceOf(Player);
});

test("loadSavedGame restores game progress into the player", async (): Promise<void> => {
    const player = new Player("ProgressBot", "password123");
    await Player.savePlayer(player);
    
    const game = player.game;
    game.TotalClicks = 500; 
    await Game.saveGame(game);
    const freshPlayer = new Player("ProgressBot", "password123");
    expect(freshPlayer.game.TotalClicks).toBe(0); 

    await freshPlayer.loadSavedGame();

    expect(freshPlayer.game.TotalClicks).toBe(500);
    expect(freshPlayer.game.id).toBeGreaterThan(0);
});

test("validatePass returns true for correct password", async (): Promise<void> => {
    const password = "1236585";
    const player = new Player("Bot", password);
    await Player.savePlayer(player);

    const isValid = await player.validatePass(password);

    expect(isValid).toBe(true);
});