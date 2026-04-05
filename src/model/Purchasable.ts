import type { Game } from "./Game";

export interface Purchasable{
    readonly name: string;
    readonly cost: number;
    readonly description?: string;
    readonly game: Game;
}