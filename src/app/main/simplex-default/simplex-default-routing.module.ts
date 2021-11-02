import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SimplexDefaultComponent } from './simplex-default.component';

const routes: Routes = [
  {
    path: '',
    component: SimplexDefaultComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SimplexDefaultRoutingModule {}
