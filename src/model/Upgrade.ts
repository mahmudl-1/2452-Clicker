import { Game } from "./Game";
//upgrade interface. requirements for a class to be classified as an upgrade
export interface Upgrade{
    readonly name: string;
    readonly cost: number;
    apply(game: Game): number
}