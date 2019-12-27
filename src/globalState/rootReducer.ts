import { IInitConfigDb, ISetPin, ILoadConfigFromDb } from "./actions";
import { ConfigEntry } from "../dm/ConfigEntry";
import PouchDb from "pouchdb-browser";
import upsertPlugin from "pouchdb-upsert";
export const initialState: AppState = {
}

export enum AppStateActionTypes {
    INIT_CONFIG_DB,
    SET_PIN,
    LOAD_CONFIG_FROM_DB
}

export interface IAppStateBaseAction {
    type: AppStateActionTypes
}

export interface AppState {
    configDb?: PouchDB.Database<ConfigEntry>,
    pin?: string
}

export type TReducerActions = IInitConfigDb | ISetPin | ILoadConfigFromDb
export function rootReducer(state: AppState = initialState, action: TReducerActions): AppState {
    switch(action.type) {
        case AppStateActionTypes.INIT_CONFIG_DB:
            console.log("Initializing DB");
            PouchDb.plugin(upsertPlugin);
            const newDb: PouchDB.Database<ConfigEntry> = new PouchDb("config");
            console.log("Loaded db");
            return { ...state, configDb: newDb, pin: "" };
        case AppStateActionTypes.LOAD_CONFIG_FROM_DB:
            console.log(action.data);
            const loadedPin = action.data.find(entry => entry._id === "pin")?.value;

            if (loadedPin) {
                console.log("Found a pin locally");
            } else {
                console.log("Could not find a pin locally");
            }
            return { ...state, pin: loadedPin };
        case AppStateActionTypes.SET_PIN:
            state.configDb?.upsert("pin", (diffDoc) => {
                diffDoc.value = action.newPin;
                return diffDoc as ConfigEntry;
            }).then((response: PouchDB.UpsertResponse) => {
                console.log(response);
            })
            .catch((err: any) => {
                console.error(err);
            });
            return { ...state, pin: action.newPin };
        default:
            return state;
    }
}