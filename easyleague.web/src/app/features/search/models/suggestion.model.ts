import { Summoner } from "@shared/models/summoner.model";

export interface Suggestion {
    duration: number,
    regions: Array<Summoner>
}
