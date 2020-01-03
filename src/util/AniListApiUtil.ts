const { ipcRenderer } = window.require('electron');

export function queryAniList<TSuccess>(url:string, pin: string, query: string, variables?: any) {
    const promise: Promise<{ body?: TSuccess, response?: any } & { err?: any }> = new Promise((resolve,reject) => {
        ipcRenderer.on('asynchronous-reply', (event, arg) => {
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
        });
        ipcRenderer.send('asynchronous-message', { 
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