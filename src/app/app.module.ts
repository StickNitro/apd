import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RootStoreModule } from '@root/store';

import { AppComponent } from './app.component';
import { ApdIncidentFormModule } from './incident-form/apd-incident-form.module';
import { ApdIncidentListModule } from './incident-list/apd-incident-list.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,

    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,

    RootStoreModule,

    ApdIncidentListModule,
    ApdIncidentFormModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
