import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faEarthEurope } from '@fortawesome/free-solid-svg-icons';
import { Region } from '@shared/models/region.model';
import { Summoner } from '@shared/models/summoner.model';

@Component({
  selector: 'app-summoner-suggestion',
  templateUrl: './summoner-suggestion.component.html',
  styleUrls: ['./summoner-suggestion.component.scss']
})
export class SummonerSuggestionComponent implements OnInit {
  faEarthEurope = faEarthEurope;

  /**
   * Summoner info retrieve from
   */
  @Input() summonerSuggestion?: Summoner;

  @Output() selectedSuggestion = new EventEmitter<Summoner>();

  /**
   * List of region.
   */
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
    if (this.summonerSuggestion !== undefined) {
      this.regionOptions.forEach((region) => {
        if (region.code === this.summonerSuggestion?.region) {
          this.regionText = region;
        }
      })
    }
  }

  selectSuggestion(): void {
    this.selectedSuggestion.emit(this.summonerSuggestion);
  }
}
