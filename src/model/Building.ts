import type { Purchasable } from "./Purchasable";

export interface Building extends Purchasable{
    readonly clickPerSecond: number;
    produceClicks():number;
}