import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  Component,
  DoCheck,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Optional,
  Renderer2,
  Self,
  SimpleChanges,
} from '@angular/core';
import { ControlValueAccessor, FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { CanUpdateErrorStateCtor, ErrorStateMatcher, mixinErrorState } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldControl } from '@angular/material/form-field';
import moment, { Moment } from 'moment';
import { Subject, Subscription } from 'rxjs';

import { TimepickerDialogComponent, TimepickerDialogComponentData } from '../timepicker-dialog/timepicker-dialog.component';

// tslint:disable: variable-name

class TimePickerInputBase {
  constructor(public _defaultErrorStateMatcher: ErrorStateMatcher,
              public _parentForm: NgForm,
              public _parentFormGroup: FormGroupDirective,
              public ngControl: NgControl) { }
}
const _TimePickerMixinBase: CanUpdateErrorStateCtor & typeof TimePickerInputBase =
  mixinErrorState(TimePickerInputBase);

// tslint:disable-next-line: no-conflicting-lifecycle
@Component({
  selector: 'ngx-timepicker-input',
  templateUrl: './timepicker-input.component.html',
  styleUrls: ['./timepicker-input.component.scss'],
  providers: [
    { provide: MatFormFieldControl, useExisting: TimePickerInputComponent }
  ]
})
export class TimePickerInputComponent extends _TimePickerMixinBase
  implements OnDestroy, DoCheck, OnChanges, MatFormFieldControl<any>, ControlValueAccessor {

  static nextId = 0;

  readonly stateChanges = new Subject<void>();
  focused = false;

  controlType = 'ngx-timepicker-input';
  protected _previousNativeValue: any;

  @Input() errorStateMatcher: ErrorStateMatcher;

  @HostBinding() id = `${this.controlType}-${TimePickerInputComponent.nextId++}`;

  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  @HostBinding('attr.aria-describedBy') describedBy = '';

  private _required = false;
  private _disabled = false;
  private _placeholder = '';
  private _rawValue: any;
  private subscriptions: { [key: string]: Subscription } = {};

  @Input() buttonColor = 'accent';
  @Input() flat: boolean;
  @Input() raised: boolean;

  propogateChange = (_: any) => {
    // ignore empty block
  }
  propogateTouched = () => {
    // ignore empty block
  }

  constructor(private fm: FocusMonitor,
              private dialog: MatDialog,
              private _elementRef: ElementRef<HTMLInputElement>,
              @Optional() @Self() public ngControl: NgControl,
              @Optional() _parentForm: NgForm,
              @Optional() _parentFormGroup: FormGroupDirective,
              _defaultErrorStateMatcher: ErrorStateMatcher,
              private renderer: Renderer2) {
    super(_defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl);
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

    this._previousNativeValue = this.value;

    fm.monitor(this._elementRef.nativeElement, true).subscribe(origin => {
      this.focused = !!origin;
      this.stateChanges.next();
    });
  }

  @Input()
  get required() {
    return this._required;
  }

  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }

  @Input()
  get disabled() {
    if (this.ngControl && this.ngControl.disabled !== null) {
      return this.ngControl.disabled;
    }
    return this._disabled;
  }

  set disabled(dis) {
    this._disabled = coerceBooleanProperty(dis);

    if (this.focused) {
      this.focused = false;
      this.stateChanges.next();
    }
  }

  @Input()
  get placeholder() {
    return this._placeholder;
  }

  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }

  @Input()
  get value(): string {
    // tslint:disable-next-line:no-null-keyword
    return this.empty ? null : this._rawValue ? this._rawValue.format('HH:mm:ss') : '';
  }

  set value(value: string) {
    this.writeValue(value);
    this.stateChanges.next();
    this.propogateChange(this.value);
  }

  get empty(): boolean {
    return !this._elementRef.nativeElement.value;
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this._elementRef.nativeElement);
    Object.values(this.subscriptions).forEach(sub => sub.unsubscribe());
  }

  ngDoCheck() {
    if (this.ngControl) {
      this.updateErrorState();
    }

    this._dirtyCheckNativeValue();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.stateChanges.next();
  }

  writeValue(value: any): void {
    let valueAsMoment: Moment;
    if (value !== '' && value !== undefined && value !== null) {
      if (typeof value === 'string') {
        if (!isNaN(Date.parse(value))) {
          valueAsMoment = moment(value);
        } else {
          valueAsMoment = moment(value, ['h:mm A', 'hh:mm A', 'HH:mm', 'H:mm', moment.HTML5_FMT.TIME_SECONDS]);
        }
      } else {
        valueAsMoment = moment(value);
      }
    } else {
      // tslint:disable-next-line:no-null-keyword
      valueAsMoment = null;
    }

    this._rawValue = valueAsMoment;
    // tslint:disable-next-line:no-null-keyword
    const momentToString = valueAsMoment ? valueAsMoment.format('LT') : null;
    this.renderer.setProperty(this._elementRef.nativeElement.querySelector('input'), 'value', momentToString);
    this.renderer.setProperty(this._elementRef.nativeElement, 'value', momentToString);
  }

  registerOnChange(fn: (_: any) => void): void {
    this.propogateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.propogateTouched = fn;
  }

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  focus(): void {
    this._elementRef.nativeElement.focus();
  }

  onContainerClick() {
    if (!this.focused) {
      this.focus();
    }
  }

  @HostListener('change', ['$event'])
  onChange(event: any) {
    const value = event.target.value;
    this.value = value;
  }

  @HostListener('focusout')
  onBlur() {
    this.propogateTouched();
    this.stateChanges.next();
  }

  setDisabledState?(isDisabled: boolean): void {
    this.renderer.setProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
  }

  protected _dirtyCheckNativeValue() {
    const newValue = this._elementRef.nativeElement.value;

    if (this._previousNativeValue !== newValue) {
      this._previousNativeValue = newValue;
      this.stateChanges.next();
    }
  }

  @HostListener('input')
  _onInput() {
    // ignore empty block
  }

  onShowTimePicker() {
    const data: TimepickerDialogComponentData = {
      userTime: moment(this.value, ['h:mm A', 'hh:mm A', 'HH:mm', 'H:mm', moment.HTML5_FMT.TIME_SECONDS])
    };

    const dialogRef = this.dialog.open(TimepickerDialogComponent, {
      panelClass: 'ngx-timepicker-dialog-container',
      data
    });

    if (this.subscriptions.dialogAfterClosedSubscription) {
      this.subscriptions.dialogAfterClosedSubscription.unsubscribe();
    }

    this.subscriptions.dialogAfterClosedSubscription = dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.value = result;
      }
    });
  }

}
