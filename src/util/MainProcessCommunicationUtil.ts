import * as uuid from 'uuid';

const { ipcRenderer } = window.require('electron');

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