import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Summoner } from '@shared/models/summoner.model';
import { environment } from 'src/environments/environment.development';
import { Suggestion } from '../models/suggestion.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(private http: HttpClient) { }

  getSummonerData(region: string, summoner: string): Promise<Summoner> {
    const url: string = `${environment.apiURL}/${region}/summoner/${summoner}`;
    
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
      .subscribe((response) => {
        resolve(response);
      })
    }) 
  }

  getAllSummonerData(summoner: string): Promise<Suggestion> {
    const url: string = `${environment.apiURL}/summoner/${summoner}/all`;

    return new Promise((resolve, reject) => {
      this.http.get<any>(url)
      .subscribe((response) => {
        resolve(response);
      })
    })
  }
}
