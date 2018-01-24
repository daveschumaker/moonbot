const request = require('request');

const requester = (url) => {
    return new Promise((resolve, reject) => {
        request(url, (error, response, body) => {
            if (error) {
                return reject(error);
            }

            try {
                return resolve(JSON.parse(body));
            } catch(err) {
                return reject(err);
            }
        });
    });
}

module.exports = requester;