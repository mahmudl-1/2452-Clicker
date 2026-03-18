import {expect, test} from 'vitest';
import{Game} from '../../src/model/Game';

test("Setting click damage to 0 should throw an error", (): void => {
    let game = new Game();

    expect(() => {
        
        game.clickDmg = 0;
        
    }).toThrow("The effect to apply cannot be zero");
});