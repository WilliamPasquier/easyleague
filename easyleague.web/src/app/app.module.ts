import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchComponent } from './features/search/search.component';
import { UserComponent } from './features/user/user.component';
import { ReplayComponent } from './features/replay/replay.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchBarComponent } from './features/search/components/search-bar/search-bar.component';
import { SearchUserComponent } from './features/search/components/search-user/search-user.component';
import { SummonerCardComponent } from './shared/components/summoner-card/summoner-card.component';


@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    UserComponent,
    ReplayComponent,
    SearchBarComponent,
    SearchUserComponent,
    SummonerCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
