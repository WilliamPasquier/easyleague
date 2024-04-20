import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './features/search/search.component';
import { ReplayComponent } from './features/replay/replay.component';
import { RoutePath } from '@shared/models/route-path.model';
import { SummonerComponent } from './features/summoner/summoner.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: RoutePath.Search,
    pathMatch: 'full',
  },
  {
    path: RoutePath.Search,
    component: SearchComponent,
  },
  {
    path: `${RoutePath.Summoner}/:region/:summoner`,
    component: SummonerComponent,
  },
  {
    path: RoutePath.Replay,
    component: ReplayComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
