const request = require('request');

module.exports = {
    queryAniList: (url, method, headers, body, electronEvent) => {
        request({
            method: method,
            url: url,
            headers: headers,
            body: body
        }, (err,response,body) => {
            electronEvent.reply('asynchronous-reply', {
                err: err,
                response: response,
                body: body
            });
        });
    }
}