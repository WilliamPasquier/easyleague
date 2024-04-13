import { Component, OnInit, inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {
  faMagnifyingGlass,
  faCircleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { Region } from '@shared/models/region.model';
import { SearchService } from '../../services/search.service';
import { Summoner } from '@shared/models/summoner.model';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit {
  faMagnifyingGlass = faMagnifyingGlass;
  faCircleExclamation = faCircleExclamation;

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
  SummonerInfo?: Summoner

  constructor() {}

  ngOnInit(): void {
    // Subscribe on field changes
    this.summonerSearch.valueChanges.subscribe((summoner) => {
      console.log(summoner);
    });
  }

  getRegionSelected(e: any): void {
    this.selectedRegion = e.target.value;
  }

  searchSummonerByName(): void {
    if (
      (this.selectedRegion === 'default' || this.selectedRegion === undefined) ||
      this.summonerSearch.valid === false
    ) {
      this.isSearchValid = false;
      return;
    } else {
      this.isSearchValid = true;
    }

    this.searchService
      .getSummonerData(this.selectedRegion, this.summonerSearch.value!)
      .then((summoner) => {
        this.SummonerInfo = summoner;
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
