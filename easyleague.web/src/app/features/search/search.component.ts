import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Region } from '@shared/models/region.model';
import { Summoner } from '@shared/models/summoner.model';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { SearchService } from './services/search.service';
import { faCircleExclamation, faMagnifyingGlass, faStopwatch, faSpinner } from '@fortawesome/free-solid-svg-icons';
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
  faSpinner = faSpinner;

  searchService = inject(SearchService);

  /**
   * List of region.
   */
  regionOptions: Array<Region> = [
    {
      name: 'AMERICAS',
      code: 'americas',
    },
    {
      name: 'ASIA',
      code: 'asia',
    },
    {
      name: 'ESPORTS',
      code: 'esports',
    },
    {
      name: 'EUROPE',
      code: 'europe',
    },
  ];

  /**
   * Search summoner field.
   */
  summonerSearch = new FormControl<string>('', {
    validators: Validators.required,
  });

  /**
   * Search summoner tag line field.
   */
  summonerTagLine = new FormControl<string>('', {
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
   * Check if the loader should be visible
   */
  isLoading: boolean = false;

  /**
   * Summoner info retrieve from
   */
  summonerInfo: Summoner | null = null;

  /**
   * Duration of the request
   */
  durationTime?: number;

  /**
   * Multiple region research suggestion.
   */
  suggestions?: Suggestion;

  constructor() { }

  ngOnInit(): void {
    this.summonerRegion.patchValue(this.selectedRegion);

    // Subscribe on field changes
    // this.subscription = this.summonerSearch.valueChanges
    // .pipe(
    //   debounceTime(500),
    //   distinctUntilChanged()
    // )
    // .subscribe((summonerInput) => {
    //   if ((summonerInput!== null && summonerInput!== "") && 
    //     this.summonerTagLine.value!== null && this.summonerTagLine.value!== "") 
    //   {
    //     this.getSummonerInfoInAllRegions(summonerInput);
    //   }
    // });
  }

  getRegionSelected(e: any): void {
    this.selectedRegion = e.target.value;
  }

  searchSummonerByName(): void {
    if (this.selectedRegion === 'default' || !this.summonerSearch.valid || !this.summonerTagLine.valid) {
      this.isSearchValid = false;
      return;
    } else {
      this.isSearchValid = true;
    }

    // if (this.summonerInfo) {
    //   this.suggestions = undefined;
    //   return;
    // }

    this.isLoading = true;

    this.searchService
      .requestSummonerData(this.selectedRegion, this.summonerSearch.value!, this.summonerTagLine.value!)
      .then(() => {
        this.summonerInfo = this.searchService.getSummoner();
        this.durationTime = this.searchService.getDurationTime();
        this.isLoading = false;
        // this.suggestions = undefined;
      })
      .catch((error) => {
        console.error(error);
        this.isLoading = false;
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

  displaySelectedSuggestion(suggestedSummoner: Summoner): void {
    this.summonerInfo = suggestedSummoner;

    const index = this.regionOptions.findIndex((r) => r.code === this.summonerInfo?.region);

    this.summonerRegion.patchValue(this.regionOptions[index].code)
    this.selectedRegion = this.regionOptions[index].code
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}