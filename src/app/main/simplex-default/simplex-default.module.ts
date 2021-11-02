import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';

import { SimplexDefaultComponent } from './simplex-default.component';
import { SimplexDefaultRoutingModule } from './simplex-default-routing.module';
import { SharedModule } from './../../shared/shared.module';

@NgModule({
  declarations: [SimplexDefaultComponent],
  imports: [
    CommonModule,
    SimplexDefaultRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatMenuModule,
  ],
  providers: [],
})
export class SimplexDefaultdModule {}
