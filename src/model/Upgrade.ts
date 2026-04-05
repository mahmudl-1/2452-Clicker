import { Game } from "./Game";
import type { Purchasable } from "./Purchasable";
//upgrade interface. requirements for a class to be classified as an upgrade
export interface Upgrade extends Purchasable{
    apply(game: Game): number
}