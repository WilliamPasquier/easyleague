import { Rank } from "./rank.model";

/**
 * Summoner interface.
 */
export interface Summoner {
    name: string;
    tagLine: string;
    profileIconId: number;
    summonerLevel: number;
    lastDateConnection: Date;
    accountRegion: string;
    region: string;
    ranks: Array<Rank>;
    matches: Array<string>;
}