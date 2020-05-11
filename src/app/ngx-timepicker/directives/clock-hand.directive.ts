import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

import { ClockType } from '../utils';

@Directive({
  selector: '[ngxClockHand]'
})
export class ClockHandDirective implements OnChanges {

  @Input('ngxClockHand') currentView: ClockType = ClockType.Hours;
  @Input() userTime: any;

  constructor(private el: ElementRef,
              private renderer: Renderer2) { }

  ngOnChanges() {
    this.getPointerStyle();
  }

  getPointerStyle() {
    let divider = 1;
    switch (this.currentView) {
      case ClockType.Hours:
        divider = 12;
        break;
      case ClockType.Minutes:
        divider = 60;
        break;
    }

    let degrees = 0;
    if (this.currentView === ClockType.Hours) {
      degrees = Math.round(this.userTime.hour() * (360 / divider)) - 180;
    } else {
      degrees = Math.round(this.userTime.minute() * (360 / divider)) - 180;
    }

    this.renderer.setStyle(this.el.nativeElement, 'transform', `rotate(${degrees}deg)`);
  }

}
