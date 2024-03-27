import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchComponent } from './features/search/search.component';
import { UserComponent } from './features/user/user.component';
import { ReplayComponent } from './features/replay/replay.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    UserComponent,
    ReplayComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
