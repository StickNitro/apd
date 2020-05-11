import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { IncidentStoreEffects } from './incident-store.effects';
import { incidentStoreReducer } from './incident-store.reducer';
import { FEATURE_NAME } from './incident-store.selectors';

@NgModule({
  imports: [
    CommonModule,

    StoreModule.forFeature(FEATURE_NAME, incidentStoreReducer),
    EffectsModule.forFeature([IncidentStoreEffects])
  ]
})
export class IncidentStoreModule { }
