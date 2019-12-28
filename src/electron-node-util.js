const request = require('request');

module.exports = {
    queryAniList: (url, method, headers, body, electronEvent) => {
        console.log(body);
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