import { Summoner } from "../../../shared/models/summoner.model";


/**
 * Summoner search interface.
 */
export interface Search {
    summoner: Summoner;
    duration: number;
}