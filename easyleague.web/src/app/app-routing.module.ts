import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoutePath } from './shared/models/route-path';
import { SearchComponent } from './features/search/search.component';
import { UserComponent } from './features/user/user.component';
import { ReplayComponent } from './features/replay/replay.component';

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
    path: RoutePath.User,
    component: UserComponent,
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
