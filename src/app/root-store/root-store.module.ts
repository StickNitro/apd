import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';

import { IncidentStoreModule } from './incident-store';
import { metaReducers, reducers } from './root-store.state';

@NgModule({
  imports: [
    IncidentStoreModule,

    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true
      }
    }),
    StoreDevtoolsModule.instrument({
      name: 'APD/Northgate Incident Reporting',
      maxAge: 25,
      logOnly: environment.production
    }),
    EffectsModule.forRoot([])
  ]
})
export class RootStoreModule { }
