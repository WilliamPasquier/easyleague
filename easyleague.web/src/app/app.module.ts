import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchComponent } from './features/search/page/search.component';
import { UserComponent } from './features/user/user.component';
import { ReplayComponent } from './features/replay/replay.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchBarComponent } from './features/search/component/search-bar/search-bar.component';
import { SearchUserComponent } from './features/search/component/search-user/search-user.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    UserComponent,
    ReplayComponent,
    SearchBarComponent,
    SearchUserComponent
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
