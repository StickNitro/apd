import { createAction, props } from '@ngrx/store';

import { Incident } from './incident-store.state';

interface SaveIncidentProps {
  incident: Incident;
}

export const saveIncident = createAction('[IncidentStore] Save Incident', props<SaveIncidentProps>());
export const saveIncidentSuccess = createAction('[IncidentStore] Save Incident Success', props<SaveIncidentProps>());

export const createIncident = createAction('[IncidentStore] Create Incident', props<SaveIncidentProps>());
export const createIncidentSuccess = createAction('[IncidentStore] Create Incident Success', props<SaveIncidentProps>());
