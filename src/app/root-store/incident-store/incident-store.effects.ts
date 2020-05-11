import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs/operators';

import { RootStoreState } from '..';
import { createIncident, createIncidentSuccess, saveIncident, saveIncidentSuccess } from './incident-store.actions';
import { selectAllIncidents } from './incident-store.selectors';

@Injectable({
  providedIn: 'root'
})
export class IncidentStoreEffects {
  constructor(private actions$: Actions,
    private store: Store<RootStoreState.State>) { }

  onSaveIncident$ = createEffect(() => this.actions$.pipe(
    ofType(saveIncident),
    map(({ incident }) => saveIncidentSuccess({ incident }))
  ));

  onCreateIncident$ = createEffect(() => this.actions$.pipe(
    ofType(createIncident),
    withLatestFrom(this.store.pipe(select(selectAllIncidents))),
    map(([{ incident }, incidents]) => createIncidentSuccess({ incident: { ...incident, id: `APD${(incidents.length + 1).toString().padStart(5, '0')}` } }))
  ));
}
