import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

export interface Incident {
  id: string;
  title: string;
  summary: string;
  dateOfIncident: Date;
}

export interface State extends EntityState<Incident> {
}

export const incidentStoreAdapter: EntityAdapter<Incident> = createEntityAdapter<Incident>({
});

export const initialState: State = incidentStoreAdapter.getInitialState({
});
