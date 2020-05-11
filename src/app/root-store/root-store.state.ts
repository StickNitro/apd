import { Action, ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from 'src/environments/environment';

// tslint:disable-next-line: no-empty-interface
export interface State {
}

export const reducers: ActionReducerMap<State> = {
};

export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  return (state: State, action: Action): State => {
    console.log('[NGRX State]: ', state);
    console.log('[NGRX Action]: ', action);
    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<State>[] = !environment.production ? [logger] : [];
