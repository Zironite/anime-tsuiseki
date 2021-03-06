import { IInitConfigDb, ISetPin, ILoadConfigFromDb, ISetUser, ISetCommands, ISetExtensions, ISetFileNameRegexes, IInitMediaSearchIndex, ISetCurrentOpenAnime, ISetWatchingAnimeList } from "./actions";
import { ConfigEntry, getFromConfigEntryList } from "../dm/ConfigEntry";
import PouchDb from "pouchdb-browser";
import upsertPlugin from "pouchdb-upsert";
import { GQLUser, GQLMediaList } from "../graphql/graphqlTypes";
import IndexContainer from "../util/IndexContainer";
import { MediaSearchIndexEntry, mediaSearchIndexEntryFields } from "../dm/MediaSearchIndexEntry";
import { CurrentOpenAnime } from "../dm/CurrentWatchedAnime";

PouchDb.plugin(upsertPlugin);

export const initialState: AppState = {
    anilistApi: "https://graphql.anilist.co",
    clientId: 2979
}

export enum AppStateActionTypes {
    INIT_CONFIG_DB,
    INIT_MEDIA_SEARCH_INDEX,
    SET_PIN,
    LOAD_CONFIG_FROM_DB,
    SET_USER,
    SET_COMMANDS,
    SET_EXTENSIONS,
    SET_FILENAME_REGEXES,
    SET_CURRENT_OPEN_ANIME,
    SET_WATCHING_ANIME_LIST
}

export interface IAppStateBaseAction {
    type: AppStateActionTypes
}

export interface AppState {
    configDb?: PouchDB.Database<ConfigEntry>,
    pin?: string,
    anilistApi?: string,
    clientId?: number,
    currentUser?: GQLUser,
    commands?: string[],
    extensions?: string[],
    fileNameRegexes?: string[],
    mediaSearchIndex?: IndexContainer<MediaSearchIndexEntry>,
    currentOpenAnime?: CurrentOpenAnime | null,
    watchingAnimeList?: GQLMediaList[]
}

export type TReducerActions = IInitConfigDb | IInitMediaSearchIndex | ISetPin | ILoadConfigFromDb | ISetUser | ISetCommands |
    ISetExtensions | ISetFileNameRegexes | ISetCurrentOpenAnime | ISetWatchingAnimeList
export function rootReducer(state: AppState = initialState, action: TReducerActions): AppState {
    switch(action.type) {
        case AppStateActionTypes.INIT_CONFIG_DB:
            console.log("Initializing DB");
            const newDb: PouchDB.Database<ConfigEntry> = new PouchDb("config");
            console.log("Loaded db");
            return { ...state, configDb: newDb, pin: "" };
        case AppStateActionTypes.INIT_MEDIA_SEARCH_INDEX:
            console.log("Initializing media search index");
            const index = new IndexContainer<MediaSearchIndexEntry>(mediaSearchIndexEntryFields);
            action.entries?.forEach(entry => index.add(entry));
            return { ...state, mediaSearchIndex: index };
        case AppStateActionTypes.LOAD_CONFIG_FROM_DB:
            console.log(action.data);
            const loadedPin = getFromConfigEntryList(action.data, "pin");
            const loadedCommands = getFromConfigEntryList(action.data, "commands")?.split(",") || 
                ["vlc"];
            const loadedExtensions = getFromConfigEntryList(action.data, "extensions")?.split(",") ||
                [".mkv",".mp4",".avi"];
            const loadedFileNameRegexes = getFromConfigEntryList(action.data, "fileNameRegexes")?.split("/") ||
                ["[.+] (?<name>.+) - (?<episode>\\d+) [.+][.+][.+]", "\\[.+\\] (?<name>.+) - (?<episode>\\d+) \\[.+\\]"];
            
            return { 
                ...state, 
                pin: loadedPin, 
                commands: loadedCommands, 
                extensions: loadedExtensions,
                fileNameRegexes: loadedFileNameRegexes
            };
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
        case AppStateActionTypes.SET_USER:
            return { ...state, currentUser: action.user};
        case AppStateActionTypes.SET_COMMANDS:
            state.configDb?.upsert("commands", (diffDoc) => {
                diffDoc.value = action.commands.join(",");
                return diffDoc as ConfigEntry
            });
            return { ...state, commands: action.commands };
        case AppStateActionTypes.SET_EXTENSIONS:
            state.configDb?.upsert("extensions", (diffDoc) => {
                diffDoc.value = action.extensions.join(",");

                return diffDoc as ConfigEntry;
            });
            return { ...state, extensions: action.extensions }
        case AppStateActionTypes.SET_FILENAME_REGEXES:
            state.configDb?.upsert("fileNameRegexes", (diffDoc) => {
                diffDoc.value = action.fileNameRegexes.join("/");

                return diffDoc as ConfigEntry;
            });
            return { ...state, fileNameRegexes: action.fileNameRegexes };
        case AppStateActionTypes.SET_CURRENT_OPEN_ANIME:
            return { ...state, currentOpenAnime: action.anime };
        case AppStateActionTypes.SET_WATCHING_ANIME_LIST:
            return { ...state, watchingAnimeList: action.data };
        default:
            return state;
    }
}