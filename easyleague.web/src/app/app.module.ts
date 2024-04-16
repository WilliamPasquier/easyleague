import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchComponent } from './features/search/search.component';
import { UserComponent } from './features/user/user.component';
import { ReplayComponent } from './features/replay/replay.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SummonerCardComponent } from './shared/components/summoner-card/summoner-card.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SummonerSuggestionComponent } from './features/search/components/summoner-suggestion/summoner-suggestion.component';


@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    UserComponent,
    ReplayComponent,
    SummonerCardComponent,
    SummonerSuggestionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
