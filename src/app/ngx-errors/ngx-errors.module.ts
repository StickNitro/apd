import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxErrorDirective } from './ngx-error.directive';
import { NgxErrorsDirective } from './ngx-errors.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    NgxErrorsDirective,
    NgxErrorDirective
  ],
  exports: [
    NgxErrorsDirective,
    NgxErrorDirective
  ]
})
export class NgxErrorsModule { }
