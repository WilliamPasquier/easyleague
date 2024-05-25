import { HttpClient } from '@angular/common/http';
import { DestroyRef, Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Search } from 'src/app/features/search/models/summoner-search.model';
import { Suggestion } from '../models/suggestion.model';
import { Summoner } from '@shared/models/summoner.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private destroyRef = inject(DestroyRef);
  private http = inject(HttpClient)

  /**
   * Summoner information.
   */
  summonerInformation: Summoner | null = null;

  /**
   * Duration time of the request.
   */
  durationTime: number = 0;

  constructor() { }

  getSummoner(): Summoner | null {
    return this.summonerInformation;
  }

  getDurationTime(): number {
    return this.durationTime;
  }

  requestSummonerData(region: string, summoner: string, tagLine: string): Promise<void> {
    const url: string = `${environment.apiURL}/v2/${region}/account/${summoner}/${tagLine}`;
    
    return new Promise((resolve, reject) => {
      this.http.get<Search>(url)
      // .pipe(catchError((error) => {
      //   if([401, 404].includes(error.status)) {
      //     resolve('');
      //   }
      //   else {
      //     reject(error);
      //   }

      //   return throwError(error);
      // }))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response) => {
        this.summonerInformation = response.summoner;
        this.durationTime = response.duration;
        resolve()
      })
    }) 
  }

  getAllSummonerData(summoner: string): Promise<Suggestion> {
    const url: string = `${environment.apiURL}/summoner/${summoner}/all`;

    return new Promise((resolve, reject) => {
      this.http.get<any>(url)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response) => {
        resolve(response);
      })
    })
  }
}
