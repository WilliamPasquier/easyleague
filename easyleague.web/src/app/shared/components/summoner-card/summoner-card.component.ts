import { Component, Input, OnInit } from '@angular/core';
import { faCalendar, faEarthEurope } from '@fortawesome/free-solid-svg-icons';
import { Summoner } from '@shared/models/summoner.model';

@Component({
  selector: 'app-summoner-card',
  templateUrl: './summoner-card.component.html',
  styleUrls: ['./summoner-card.component.scss']
})
export class SummonerCardComponent implements OnInit {
  faEarthEurope = faEarthEurope;
  faCalendar = faCalendar;

  /**
   * Summoner info retrieve from
   */
  @Input() summonerInfo?: Summoner

  /**
   * Last connection date
   */
  lastDateConnection?: string; 

  ngOnInit(): void {
    // this.lastDateConnection = new Date(this.summonerInfo?.lastDateConnection).toDateString();
  }

  dateToString (date: Date): string {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };

    return date.toLocaleString('fr-FR');
  }
}
