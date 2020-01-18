import { IAppStateBaseAction, AppStateActionTypes } from "./rootReducer";
import { ConfigEntry } from "../dm/ConfigEntry";
import { GQLUser, GQLMedia, GQLMediaList } from "../graphql/graphqlTypes";
import { MediaSearchIndexEntry } from "../dm/MediaSearchIndexEntry";
import { CurrentOpenAnime } from "../dm/CurrentWatchedAnime";

export interface IInitConfigDb extends IAppStateBaseAction {
    type: AppStateActionTypes.INIT_CONFIG_DB
}

export interface IInitMediaSearchIndex extends IAppStateBaseAction {
    type: AppStateActionTypes.INIT_MEDIA_SEARCH_INDEX,
    entries?: MediaSearchIndexEntry[]
}

export interface ISetPin extends IAppStateBaseAction {
    type: AppStateActionTypes.SET_PIN,
    newPin: string
}

export interface ILoadConfigFromDb extends IAppStateBaseAction {
    type: AppStateActionTypes.LOAD_CONFIG_FROM_DB,
    data: Array<ConfigEntry>
}

export interface ISetUser extends IAppStateBaseAction {
    type: AppStateActionTypes.SET_USER,
    user: GQLUser
}

export interface ISetCommands extends IAppStateBaseAction {
    type: AppStateActionTypes.SET_COMMANDS,
    commands: string[]
}

export interface ISetExtensions extends IAppStateBaseAction {
    type: AppStateActionTypes.SET_EXTENSIONS,
    extensions: string[]
}

export interface ISetFileNameRegexes extends IAppStateBaseAction {
    type: AppStateActionTypes.SET_FILENAME_REGEXES,
    fileNameRegexes: string[]
}

export interface ISetCurrentOpenAnime extends IAppStateBaseAction {
    type: AppStateActionTypes.SET_CURRENT_OPEN_ANIME,
    anime: CurrentOpenAnime | null
}

export interface ISetWatchingAnimeList extends IAppStateBaseAction {
    type: AppStateActionTypes.SET_WATCHING_ANIME_LIST,
    data: GQLMediaList[]
}