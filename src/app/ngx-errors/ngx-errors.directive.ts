import { AfterViewInit, Directive, Input, OnChanges, OnDestroy } from '@angular/core';
import { AbstractControl, FormGroupDirective } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

export const toArray = (value: string | string[]): string[] => Array.isArray(value) ? value : [value];

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[ngxErrors]',
  exportAs: 'ngxErrors'
})
export class NgxErrorsDirective implements OnChanges, OnDestroy, AfterViewInit {

  @Input('ngxErrors') controlName: string;

  subject = new BehaviorSubject<{ control: AbstractControl, errorName: string }>(undefined as any);
  control: AbstractControl;
  ready = false;

  constructor(private form: FormGroupDirective) {
  }

  get errors() {
    if (!this.ready) {
      return undefined;
    }
    return this.control.errors;
  }

  get hasErrors() {
    return !!this.errors;
  }

  hasError(name: string, conditions: string | string[]): boolean {
    return this.checkPropState('invalid', name, conditions);
  }

  isValid(name: string, conditions: string | string[]): boolean {
    return this.checkPropState('valid', name, conditions);
  }

  getError(name: string) {
    if (!this.ready) {
      return undefined;
    }
    return this.control.getError(name);
  }

  ngOnChanges() {
    this.control = this.form.control.get(this.controlName);
  }

  ngOnDestroy() {
    this.subject.unsubscribe();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.checkStatus();
      this.control.statusChanges.subscribe(this.checkStatus.bind(this));
    });
  }

  private checkPropState(property: string, name: string, conditions: string | string[]): boolean {
    if (!this.ready) {
      return false;
    }
    const controlPropsState = (
      !conditions || toArray(conditions).every((condition: string) => (this.control as any)[condition])
    );
    if (name.charAt(0) === '*') {
      return (this.control as any)[property] && controlPropsState;
    }
    return (
      property === 'valid' ? !this.control.hasError(name) : this.control.hasError(name) && controlPropsState
    );
  }

  private checkStatus() {
    const control = this.control;
    const errors = control.errors;
    this.ready = true;
    if (!errors) {
      return;
    }
    // tslint:disable-next-line:forin
    for (const errorName in errors) {
      this.subject.next({ control, errorName });
    }
  }

}
