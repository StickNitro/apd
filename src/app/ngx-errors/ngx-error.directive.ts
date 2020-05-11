import { Directive, DoCheck, forwardRef, HostBinding, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

import { NgxErrorsDirective, toArray } from './ngx-errors.directive';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[ngxError]'
})
export class NgxErrorDirective implements OnInit, DoCheck, OnDestroy {

  @Input() set ngxError(value: string | string[]) {
    this.errorNames = toArray(value);
  }

  @Input() set when(value: string | string[]) {
    this.rules = toArray(value);
  }

  @HostBinding('hidden') hidden = true;

  rules: string[] = [];
  errorNames: string[] = [];
  subscription: Subscription;
  states: Subject<string[]>;
  states$: Observable<string[]>;

  constructor(@Inject(forwardRef(() => NgxErrorsDirective)) private ngxErrors: NgxErrorsDirective) { }

  ngOnInit() {
    this.states = new Subject<string[]>();
    this.states$ = this.states.asObservable().pipe(distinctUntilChanged());

    const errorsSubject = this.ngxErrors.subject.pipe(
      filter(Boolean),
      filter((obj: any) => this.errorNames.includes(obj.errorName))
    );

    const statesSubject = this.states$.pipe(
      map(states => this.rules.every(rule => states.includes(rule)))
    );

    this.subscription = combineLatest([statesSubject, errorsSubject])
      .subscribe(([states, errors]) => {
        this.hidden = !(states && errors.control.hasError(errors.errorName));
      });
  }

  ngDoCheck() {
    this.states.next(
      this.rules.filter((rule) => (this.ngxErrors.control as any)[rule])
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
