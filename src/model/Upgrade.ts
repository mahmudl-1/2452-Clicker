import { Game } from "./Game";
export interface Upgrade{
    readonly name: string;
    readonly cost: number;
    apply(game: Game): number
}