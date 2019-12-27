import { IAppStateBaseAction, AppStateActionTypes } from "./rootReducer";
import { ConfigEntry } from "../dm/ConfigEntry";

export interface IInitConfigDb extends IAppStateBaseAction {
    type: AppStateActionTypes.INIT_CONFIG_DB
}

export interface ISetPin extends IAppStateBaseAction {
    type: AppStateActionTypes.SET_PIN,
    newPin: string
}

export interface ILoadConfigFromDb extends IAppStateBaseAction {
    type: AppStateActionTypes.LOAD_CONFIG_FROM_DB,
    data: Array<ConfigEntry>
}