import { Component, Input, OnInit } from '@angular/core';
import { faCalendar, faEarthEurope } from '@fortawesome/free-solid-svg-icons';
import { Summoner } from '@shared/models/summoner.model';

@Component({
  selector: 'app-summoner-card',
  templateUrl: './summoner-card.component.html',
  styleUrls: ['./summoner-card.component.scss'],
})
export class SummonerCardComponent implements OnInit {
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

  ngOnInit(): void {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      weekday: 'long',
      month: 'long',
      year: 'numeric',
    };

    if (this.summonerInfo && this.summonerInfo.lastDateConnection) {
      this.lastDateConnection = new Date(
        this.summonerInfo.lastDateConnection
      ).toLocaleString('fr-FR', options);
    }
  }
}
