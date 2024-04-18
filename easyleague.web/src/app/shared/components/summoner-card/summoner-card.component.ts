import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { faCalendar, faEarthEurope, faMedal } from '@fortawesome/free-solid-svg-icons';
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
  faMedal = faMedal;
  
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
    name: 'Brazil',
    code: 'br',
  },
  {
    name: 'Latin America North',
    code: 'lan',
  },
  {
    name: 'Latin America South',
    code: 'las',
  },
  {
    name: 'Oceania',
    code: 'oce',
  },
  {
    name: 'Russia',
    code: 'ru',
  },
  {
    name: 'Turkey',
    code: 'tr',
  },
  {
    name: 'The Philippines',
    code: 'ph',
  },
  {
    name: 'Singapore, Malaysia, & Indonesia',
    code: 'sg',
  },
  {
    name: 'Taiwan, Hong Kong, and Macao',
    code: 'tw',
  },
  {
    name: 'Thailand',
    code: 'th',
  },
  {
    name: 'Vietnam',
    code: 'vn',
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
