import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Summoner } from '@shared/models/summoner.model';
import { SearchService } from '@shared/services/search.service';

@Component({
  selector: 'app-summoner',
  templateUrl: './summoner.component.html',
  styleUrls: ['./summoner.component.scss']
})
export class SummonerComponent implements OnInit{
  activatedRoute = inject(ActivatedRoute);
  
  searchService = inject(SearchService);
  
  region!: string;
  
  summoner!: string;

  tagLine!: string;

  summonerInfo?: Summoner;

  ngOnInit(): void {
    this.region = this.activatedRoute.snapshot.params['region'];
    this.summoner = this.activatedRoute.snapshot.params['summoner'];
    this.tagLine = this.activatedRoute.snapshot.params['tagLine'];

    this.searchService
      .getSummonerData('europe', this.summoner, this.tagLine)
      .then((summoner) => {
        this.summonerInfo = summoner.summoner;
        console.log(this.summonerInfo);
      })
      .catch((error) => {
        console.error(error);
      });
  }
}