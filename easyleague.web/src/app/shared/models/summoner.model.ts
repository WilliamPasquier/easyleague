import { Rank } from "./rank.model";

/**
 * Summoner interface.
 */
export interface Summoner {
    name: string;
    profileIconId: number;
    summonerLevel: number;
    lastDateConnection: number;
    region: string;
    ranks: Array<Rank>
}