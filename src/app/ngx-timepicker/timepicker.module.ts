import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MomentModule } from 'ngx-moment';

import { TimepickerClockComponent } from './components/timepicker-clock/timepicker-clock.component';
import { TimepickerDialogComponent } from './components/timepicker-dialog/timepicker-dialog.component';
import { TimePickerInputComponent } from './components/timepicker-input/timepicker-input.component';
import { ClockHandDirective } from './directives/clock-hand.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatTooltipModule,

    FlexLayoutModule,

    ReactiveFormsModule,
    MomentModule
  ],
  declarations: [
    ClockHandDirective,
    TimePickerInputComponent,
    TimepickerDialogComponent,
    TimepickerClockComponent
  ],
  exports: [
    TimePickerInputComponent
  ],
  entryComponents: [
    TimepickerDialogComponent
  ]
})
export class TimePickerModule { }
