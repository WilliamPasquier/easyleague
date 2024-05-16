import { HttpClient } from '@angular/common/http';
import { DestroyRef, Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Search } from 'src/app/features/search/models/summoner-search.model';
import { Suggestion } from '../models/suggestion.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private destroyRef = inject(DestroyRef);
  private http = inject(HttpClient)

  constructor() { }

  getSummonerData(region: string, summoner: string, tagLine: string): Promise<Search> {
    const url: string = `${environment.apiURL}/v2/${region}/account/${summoner}/${tagLine}`;
    
    return new Promise((resolve, reject) => {
      this.http.get<any>(url)
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
        resolve(response);
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
