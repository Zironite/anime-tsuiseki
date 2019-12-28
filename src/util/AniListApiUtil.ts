const { ipcRenderer } = window.require('electron');

export function queryAniList(url:string, pin: string, query: string) {
    const promise = new Promise((resolve,reject) => {
        ipcRenderer.on('asynchronous-reply', (event, arg) => {
            if (arg.err) {
                reject(arg.err);
            } else {
                resolve({
                    body: arg.body,
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
                query: query
            })
        });
    });
    return promise;
}