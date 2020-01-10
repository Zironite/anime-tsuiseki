import * as uuid from 'uuid';
import { ProcessMonitorMessage } from '../dm/ProcessMonitorMessage';
import { store } from "../index";
import { GQLMedia, GQLQuery } from '../graphql/graphqlTypes';
import { loader } from 'graphql.macro';
import { AppStateActionTypes } from '../globalState/rootReducer';

const { ipcRenderer } = window.require('electron');
const query = loader("../graphql/queries/GetAnimeById.gql");
ipcRenderer.on("process-monitor", (e,message: ProcessMonitorMessage) => {
    const currentState = store.getState();
    const queryResult = currentState.mediaSearchIndex?.search(message.name);
    
    if ((queryResult?.length || 0) > 0 && currentState.anilistApi && currentState.pin &&
        queryResult![0].key !== currentState.currentOpenAnime?.id) {
        type IGetAnimeById = {
            data: GQLQuery
        }
        queryAniList<IGetAnimeById>(currentState.anilistApi!,
            currentState.pin!,
            query.loc?.source.body!,
            {
                id: queryResult![0].key
            }).then(response => {
                store.dispatch({
                    type: AppStateActionTypes.SET_CURRENT_OPEN_ANIME,
                    anime: response.body?.data.Media!
                });
            }).catch(err => console.log(err));
    }
})

export function queryAniList<TSuccess>(url:string, pin: string, query: string, variables?: any) {
    const request_id = uuid.v4();
    const promise: Promise<{ body?: TSuccess, response?: any } & { err?: any }> = new Promise((resolve,reject) => {
        ipcRenderer.on('asynchronous-reply', (event, arg) => {
            if (arg.request_id === request_id) {
                if (arg.err) {
                    reject({
                        err: arg.err
                    });
                } else {
                    resolve({
                        body: JSON.parse(arg.body) as TSuccess,
                        response: arg.response
                    });
                }
            }
        });
        ipcRenderer.send('asynchronous-message', { 
            request_id: request_id,
            type: 'queryAniList',
            url: url, 
            method: 'POST', 
            headers: {
                'Authorization': `Bearer ${pin}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        });
    });
    return promise;
}

export function setProcessCommandsToMonitor(commands: string[]) {
    const request_id = uuid.v4();
    ipcRenderer.send('asynchronous-message', {
        request_id: request_id,
        type: 'setProcessCommandsToMonitor',
        commands: commands
    });
}

export function setAcceptedExtensions(extensions: string[]) {
    const request_id = uuid.v4();
    ipcRenderer.send('asynchronous-message', {
        request_id: request_id,
        type: "setAcceptedExtensions",
        extensions: extensions
    });
}

export function setFileNameRegexes(fileNameRegexes: string[]) {
    const request_id = uuid.v4();
    ipcRenderer.send('asynchronous-message', {
        request_id: request_id,
        type: "setFileNameRegexes",
        fileNameRegexes: fileNameRegexes
    });
}