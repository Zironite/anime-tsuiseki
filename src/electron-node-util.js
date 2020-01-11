const request = require('request');
const util = require('util');
const exec = util.promisify(require("child_process").exec);
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
        monitorProcessesConfig.fileNameRegexes = value.map(r => {
            try {
                return new RegExp(r);
            } catch (error) {
                console.error(error);
                return null;
            }
        }).filter(r => r);
    },
    monitorProcesses: (webContents) => {
        psList().then((response) => {
            const relevantProcesses = response.filter(p => monitorProcessesConfig.commands.find(c => c === p.name));
            let foundCurrentAnime = false;
            let promises = []
            relevantProcesses.forEach(p => {
                const pathOfFd = `/proc/${p.pid}/fd/`;
                let execPromise = exec(`for f in $(ls ${pathOfFd}); do readlink "${pathOfFd}/$f"; done`);
                promises.push(execPromise);
                execPromise.then(response => {
                    const stdout = response.stdout;
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

                                if (!monitorProcessesConfig.currentOpenAnime || (foundAnimeName === monitorProcessesConfig.currentOpenAnime.name &&
                                    foundAnimeEpisode === monitorProcessesConfig.currentOpenAnime.episode)) {
                                        webContents.send("process-monitor", {
                                            name: foundAnimeName,
                                            episode: foundAnimeEpisode,
                                            isFound: true
                                        });
                                        foundCurrentAnime = true;
                                }
                            }
                        }
                    });
                }).catch(err => console.error(err));
            });

            Promise.all(promises).then(() => {
                if (!foundCurrentAnime && monitorProcessesConfig.currentOpenAnime) {
                    webContents.send("process-monitor", {
                        name: monitorProcessesConfig.currentOpenAnime.name,
                        episode: monitorProcessesConfig.currentOpenAnime.episode,
                        isFound: false
                    });
                }
            }).catch(err => console.error(err));
            
        }).catch(err => console.error(err));        
    },
    setCurrentOpenAnime: (name,episode) => {
        if (!monitorProcessesConfig.currentOpenAnime) {
            monitorProcessesConfig.currentOpenAnime = {}
        }
        monitorProcessesConfig.currentOpenAnime.name = name;
        monitorProcessesConfig.currentOpenAnime.episode = episode;
    }
}