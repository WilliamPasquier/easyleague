import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Region } from '@shared/models/region.model';
import { Summoner } from '@shared/models/summoner.model';
import { Subscription } from 'rxjs';
import { SearchService } from './services/search.service';
import { faCircleExclamation, faMagnifyingGlass, faStopwatch } from '@fortawesome/free-solid-svg-icons';
import { Suggestion } from './models/suggestion.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  faMagnifyingGlass = faMagnifyingGlass;
  faCircleExclamation = faCircleExclamation;
  faStopwatch = faStopwatch;

  searchService = inject(SearchService);

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

  /**
   * Search summoner field.
   */
  summonerSearch = new FormControl<string>('', {
    validators: Validators.required,
  });

  /**
   * Region summoner field.
   */
  summonerRegion = new FormControl<string>('', {
    validators: Validators.required,
  });

  private subscription: Subscription = new Subscription();

  /**
   * Region selected by the user.
   */
  selectedRegion: string = 'default';

  /**
   * Check if is possible to perform the search
   */
  isSearchValid: boolean = true;

  /**
   * Summoner info retrieve from
   */
  summonerInfo?: Summoner

  suggestions?: Suggestion;

  constructor() { }

  ngOnInit(): void {
    this.summonerRegion.patchValue(this.selectedRegion);

    // Subscribe on field changes
    this.subscription = this.summonerSearch.valueChanges.subscribe((summonerInput) => {
      if (summonerInput !== null && summonerInput !== "") {
        this.getSummonerInfoInAllRegions(summonerInput);
      }
    });
  }

  getRegionSelected(e: any): void {
    this.selectedRegion = e.target.value;
  }

  searchSummonerByName(): void {
    if (this.selectedRegion === 'default' || !this.summonerSearch.valid) {
      this.isSearchValid = false;
      return;
    } else {
      this.isSearchValid = true;
    }

    if (this.summonerInfo) {
      this.suggestions = undefined;
      return;
    }

    this.searchService
      .getSummonerData(this.selectedRegion, this.summonerSearch.value!)
      .then((summoner) => {
        this.summonerInfo = summoner;
        this.suggestions = undefined;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  getSummonerInfoInAllRegions(summoner: string) {
    this.searchService.getAllSummonerData(summoner)
      .then((summoners) => {
        this.suggestions = summoners;

        console.log(this.suggestions);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  displaySelectedSUggestion(suggestedSummoner: Summoner): void {
    this.summonerInfo = suggestedSummoner;

    const index = this.regionOptions.findIndex((r) => r.code === this.summonerInfo?.region);

    this.summonerRegion.patchValue(this.regionOptions[index].code)
    this.selectedRegion = this.regionOptions[index].code
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}