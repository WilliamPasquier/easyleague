import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { Region } from '@shared/models/region.model';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {
  faMagnifyingGlass = faMagnifyingGlass;

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
    }
  ]

  /**
   * Search summoner field.
   */
  summonerSearch = new FormControl<string>('');

  constructor() { }
  
  ngOnInit(): void {
    // Subscribe on field changes
    this.summonerSearch.valueChanges.subscribe(summoner => {
      console.log(summoner)
    })
  }
  
  searchSummonerByName(): void {
    console.log(this.summonerSearch.value);
  }
}
