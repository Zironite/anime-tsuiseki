export const initialState: AppState = {
}

export enum AppStateActionTypes {
    INIT_DB
}

export interface IAppStateBaseAction {
    type: AppStateActionTypes
}

export interface AppState {
    db?: PouchDB.Database
}

export function rootReducer(state: AppState = initialState, action: IAppStateBaseAction): AppState {
    switch(action.type) {
        case AppStateActionTypes.INIT_DB:
            return { ...state, db: new PouchDB("local") };
        default:
            return state;
    }
}