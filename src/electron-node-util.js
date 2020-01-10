const request = require('request');
const exec = require("child_process").exec;
const psList = require("ps-list");

const monitorProcessesConfig = {
    commands: [],
    extensions: [],
    fileNameRegexes: []
}

module.exports = {
    queryAniList: (url, method, headers, body, electronEvent) => {
        request({
            method: method,
            url: url,
            headers: headers,
            body: body
        }, (err,response,body) => {
            electronEvent.reply('asynchronous-reply', {
                request_id: electronEvent.tsuiseki_request_id,
                err: err,
                response: response,
                body: body
            });
        });
    },
    setProcessCommandsToMonitor: (value) => {
        monitorProcessesConfig.commands = value;
    },
    setAcceptedExtensions: (value) => {
        monitorProcessesConfig.extensions = value;
    },
    setFileNameRegexes: (value) => {
        monitorProcessesConfig.fileNameRegexes = value.map(r => new RegExp(r));
    },
    monitorProcesses: () => {
        psList().then((response) => {
            const relevantProcesses = response.filter(p => monitorProcessesConfig.commands.find(c => c === p.name));
            relevantProcesses.forEach(p => {
                const pathOfFd = `/proc/${p.pid}/fd/`;
                exec(`for f in $(ls ${pathOfFd}); do readlink "${pathOfFd}/$f"; done`, (err,stdout,stderr) => {
                    const fileNames = stdout.split("\n");
                    const onlyMediaFiles = fileNames.filter(fileName => 
                        monitorProcessesConfig.extensions.find(extension => fileName.endsWith(extension)))
                        .map(fileName => fileName.substring(fileName.lastIndexOf("/")+1, fileName.lastIndexOf(".")));
                    
                    onlyMediaFiles.forEach(fileName => {
                        for (let i = 0; i < monitorProcessesConfig.fileNameRegexes.length; i++) {
                            const element = monitorProcessesConfig.fileNameRegexes[i];
                            
                            const extractedGroups = fileName.match(element);
                            console.log(extractedGroups);
                        }
                    });
                });
            });
        }).catch(err => console.error(err));        
    }
}