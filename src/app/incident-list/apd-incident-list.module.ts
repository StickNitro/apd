import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MomentModule } from 'ngx-moment';

import { IncidentListComponent } from './incident-list/incident-list.component';

@NgModule({
  imports: [
    CommonModule,

    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,

    FlexLayoutModule,
    MomentModule
  ],
  declarations: [
    IncidentListComponent
  ],
  exports: [IncidentListComponent]
})
export class ApdIncidentListModule { }
