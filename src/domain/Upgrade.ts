import { Game } from "./game";
export interface Upgrade{
    readonly name: string;
    readonly cost: number;
    apply(game: Game): void
}