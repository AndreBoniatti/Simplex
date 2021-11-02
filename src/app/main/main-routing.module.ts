import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { MainComponent } from './main.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((x) => x.DashboardModule),
        canActivate: [],
      },
      {
        path: 'simplex-default',
        loadChildren: () =>
          import('./simplex-default/simplex-default.module').then(
            (x) => x.SimplexDefaultdModule
          ),
        canActivate: [],
      },
    ],
  },
  {},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
