import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { faCalendar, faEarthEurope } from '@fortawesome/free-solid-svg-icons';
import { Region } from '@shared/models/region.model';
import { Summoner } from '@shared/models/summoner.model';

@Component({
  selector: 'app-summoner-card',
  templateUrl: './summoner-card.component.html',
  styleUrls: ['./summoner-card.component.scss'],
})
export class SummonerCardComponent implements OnInit, OnChanges {
  faEarthEurope = faEarthEurope;
  faCalendar = faCalendar;
  
  /**
   * Summoner info retrieve from
  */
  @Input() summonerInfo?: Summoner;
  
  /**
   * Last connection date
  */
 lastDateConnection?: string;

 regionOptions: Array<Region> = [
   {
     name: 'Europe West',
     code: 'euw',
    },
    {
      name: 'Europe Nordic & East',
      code: 'eun',
    },
    {
      name: 'Japan',
      code: 'jp',
    },
    {
      name: 'Republic of Korea',
      code: 'kr',
    },
    {
      name: 'North America',
      code: 'na',
    },
  ];
  
  regionText?: Region;
  
  ngOnInit(): void {
    if (this.summonerInfo !== undefined) {
      this.regionOptions.forEach((region) => {
        if (region.code === this.summonerInfo?.region) {
          this.regionText = region;
        }
      })
    }

    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      weekday: 'long',
      month: 'long',
      year: 'numeric',
    };

    if (this.summonerInfo && this.summonerInfo.lastDateConnection) {
      this.lastDateConnection = new Date(
        this.summonerInfo.lastDateConnection
      ).toLocaleString('en-GB', options);
    }
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    this.ngOnInit();
  }
}
