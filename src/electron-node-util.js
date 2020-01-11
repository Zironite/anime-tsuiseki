const request = require('request');
const exec = require("child_process").exec;
const psList = require("ps-list");

const monitorProcessesConfig = {
    commands: [],
    extensions: [],
    fileNameRegexes: [],
    currentOpenAnime: {}
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
    monitorProcesses: (webContents) => {
        psList().then((response) => {
            const relevantProcesses = response.filter(p => monitorProcessesConfig.commands.find(c => c === p.name));
            const foundCurrentAnime = false;
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
                            if (extractedGroups) {
                                const foundAnimeName = extractedGroups.groups.name;
                                const foundAnimeEpisode = parseInt(extractedGroups.groups.episode || 0);

                                if (foundAnimeName === monitorProcessesConfig.currentOpenAnime.name &&
                                    foundAnimeEpisode === monitorProcessesConfig.currentOpenAnime.episode) {
                                        foundCurrentAnime = true;
                                }

                                webContents.send("process-monitor", {
                                    name: foundAnimeName,
                                    episode: foundAnimeEpisode,
                                    isFound: true
                                });
                            }
                        }
                    });
                });
            });

            if (!foundCurrentAnime) {
                webContents.send("process-monitor", {
                    name: monitorProcessesConfig.currentOpenAnime.name,
                    episode: monitorProcessesConfig.currentOpenAnime.episode,
                    isFound: false
                });
            }
        }).catch(err => console.error(err));        
    },
    setCurrentOpenAnime: (name,episode) => {
        monitorProcessesConfig.currentOpenAnime.name = name;
        monitorProcessesConfig.currentOpenAnime.episode = episode;
    }
}