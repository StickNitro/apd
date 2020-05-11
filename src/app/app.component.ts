import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { IncidentStoreActions, IncidentStoreSelectors, IncidentStoreState, RootStoreState } from '@root/store';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  incidents$ = this.store.pipe(select(IncidentStoreSelectors.selectAllIncidents));

  editorStateSubject = new ReplaySubject<boolean>();
  editorState$ = this.editorStateSubject.asObservable();

  incidentSubject = new ReplaySubject<IncidentStoreState.Incident>();
  incident$ = this.incidentSubject.asObservable();

  constructor(private store: Store<RootStoreState.State>) { }

  onCreateIncident(): void {
    this.editorStateSubject.next(true);
  }

  onEditIncident(incident: IncidentStoreState.Incident): void {
    this.incidentSubject.next(incident);
    this.editorStateSubject.next(true);
  }

  onCloseEditor(): void {
    this.editorStateSubject.next(false);
    this.incidentSubject.next(undefined);
  }

  onSaveIncident(incident: IncidentStoreState.Incident): void {
    incident.id ?
      this.store.dispatch(IncidentStoreActions.saveIncident({ incident })) :
      this.store.dispatch(IncidentStoreActions.createIncident({ incident }));
    this.onCloseEditor();
  }
}
