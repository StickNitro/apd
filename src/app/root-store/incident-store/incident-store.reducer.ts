import { Action, createReducer, on } from '@ngrx/store';

import { createIncidentSuccess, saveIncidentSuccess } from './incident-store.actions';
import { incidentStoreAdapter, initialState, State } from './incident-store.state';

export const reducer = createReducer(
  initialState,
  on(createIncidentSuccess, (state, { incident }) => incidentStoreAdapter.addOne(incident, state)),
  on(saveIncidentSuccess, (state, { incident }) => incidentStoreAdapter.updateOne({
    id: incident.id,
    changes: incident
  }, state))
);

export function incidentStoreReducer(state: State | undefined, action: Action) {
  return reducer(state, action);
}
