import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import moment, { Moment } from 'moment';

import { ClockType } from '../../utils';

@Component({
  selector: 'ngx-timepicker-clock',
  templateUrl: './timepicker-clock.component.html',
  styleUrls: ['./timepicker-clock.component.scss']
})
export class TimepickerClockComponent implements OnInit, OnDestroy, OnChanges {

  @ViewChild('clock', { static: true }) clock: ElementRef;

  @Input() userTime: any;
  @Input() currentView: ClockType;
  @Input() autoSwitch: boolean;

  @Output() viewChange = new EventEmitter<ClockType>();
  @Output() userTimeChange = new EventEmitter<Moment>();

  stepDegrees = 360 / 12;
  steps: Array<number> = [];
  selectedTimePart: number;
  private clockClickListener: () => void;

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
    this.clockClickListener = this.renderer.listen(this.clock.nativeElement, 'click', (e) => {
      return this.handleClick(e);
    });
  }

  ngOnChanges() {
    this.setupUI();
  }

  ngOnDestroy() {
    if (this.clockClickListener) {
      this.clockClickListener();
    }
  }

  handleClick(e: any) {
    const containerCoords = e.currentTarget.getClientRects()[0];
    const x = ((e.currentTarget.offsetWidth / 2) - (e.pageX - containerCoords.left));
    const y = ((e.pageY - containerCoords.top) - (e.currentTarget.offsetHeight / 2));

    const deg = Math.round((Math.atan2(x, y) * (180 / Math.PI)));
    setTimeout(() => {
      this.setTimeByDeg(deg + 180);
    });
    e.stopPropagation();
    return false;
  }

  setTimeByDeg(deg: number) {
    let divider = 0;
    switch (this.currentView) {
      case ClockType.Hours:
        divider = 12;
        break;

      case ClockType.Minutes:
        divider = 60;
        break;
    }

    let time = Math.round(divider / 360 * deg);
    if (this.currentView === ClockType.Hours && time === 0) {
      time = 12;
    } else if (this.currentView === ClockType.Minutes && time === 60) {
      time = 0;
    }
    this.changeTimeValue(time);
  }

  changeTimeValue(step: number) {
    if (this.currentView === ClockType.Hours) {
      const newTime = this.userTime.hour(this.userTime.format('A') === 'AM' ? step : step + 12);
      this.userTimeChange.emit(moment(newTime));
      this.emitIfAutoSwitch(ClockType.Minutes);
    } else {
      const newTime = this.userTime.minute(step);
      this.userTimeChange.emit(moment(newTime));
      this.emitIfAutoSwitch(ClockType.Hours);
    }
  }

  emitIfAutoSwitch(type: number) {
    if (this.autoSwitch) {
      this.viewChange.emit(type);
    } else {
      this.setupUI();
    }
  }

  getTimeValueClass(step: number, index: number) {
    let classes = 'mat-button mat-raised ngx-clock-deg' + (this.stepDegrees * (index + 1));
    if (this.selectedTimePart === step) {
      classes += ' mat-primary selected';
    } else {
      classes += ' ngx-clock-deg';
    }
    return classes;
  }

  private setupUI() {
    this.steps = [];

    switch (this.currentView) {
      case ClockType.Hours:
        for (let i = 1; i <= 12; i++) {
          this.steps.push(i);
        }

        this.selectedTimePart = this.userTime.hour() || 0;
        if (this.selectedTimePart > 12) {
          this.selectedTimePart -= 12;
        }
        break;

      case ClockType.Minutes:
        for (let i = 5; i <= 55; i += 5) {
          this.steps.push(i);
        }

        this.steps.push(0);
        this.selectedTimePart = this.userTime.minute() || 0;
        break;
    }
  }

}
