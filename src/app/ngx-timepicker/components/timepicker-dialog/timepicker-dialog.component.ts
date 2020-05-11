import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import moment, { Moment } from 'moment';

import { ClockType } from '../../utils';

export interface TimepickerDialogComponentData {
  userTime: Moment;
}

@Component({
  templateUrl: './timepicker-dialog-v.component.html',
  styleUrls: ['./timepicker-dialog.component.scss']
})
export class TimepickerDialogComponent {

  userTime: Moment;
  currentView: ClockType = ClockType.Hours;
  viewHours = ClockType.Hours;
  viewMinutes = ClockType.Minutes;

  constructor(@Inject(MAT_DIALOG_DATA) { userTime }: TimepickerDialogComponentData,
              private dialogRef: MatDialogRef<TimepickerDialogComponent>) {
    this.userTime = userTime.isValid() ? userTime : moment();
  }

  setCurrentView(type: ClockType) {
    this.currentView = type;
  }

  setMeridian(meridian: string) {
    if (meridian === 'AM' && this.userTime.format('A') !== 'AM') {
      const newTime = this.userTime.hour(this.userTime.hour() - 12);
      this.userTime = moment(newTime);
    } else if (meridian === 'PM' && this.userTime.format('A') !== 'PM') {
      const newTime = this.userTime.hour(this.userTime.hour() + 12);
      this.userTime = moment(newTime);
    }
  }

  onCancel() {
    this.dialogRef.close(undefined);
  }

  onSubmit() {
    this.dialogRef.close(this.userTime);
  }

}
