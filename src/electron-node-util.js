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
                request_id: electronEvent.tsuiseki_request_id,
                err: err,
                response: response,
                body: body
            });
        });
    }
}