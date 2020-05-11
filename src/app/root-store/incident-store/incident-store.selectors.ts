import { createFeatureSelector, MemoizedSelector } from '@ngrx/store';

import { Incident, incidentStoreAdapter, State } from './incident-store.state';

export const FEATURE_NAME = 'incidentState';

export const selectIncidentState: MemoizedSelector<object, State>
  = createFeatureSelector<State>(FEATURE_NAME);

export const selectAllIncidents: (state: object) => Incident[]
  = incidentStoreAdapter.getSelectors(selectIncidentState).selectAll;
