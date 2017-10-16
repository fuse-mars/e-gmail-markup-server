'use strict'
/**
 * Handling request sent from Gmail Client by "e-gmail-markup" chrome-extension
 * source: https://bcb.github.io/jsonrpc/node
 */
let jayson = require('jayson')
let request = require('request')

// from Google
const HttpRequestMethod = {
    GET: 'HttpRequestMethod.GET'
}

var gmailActions = {
    [HttpRequestMethod.GET]: new jayson.Method({
        handler: function(payload, done) {
            console.log(payload);
            let { url } = payload
            

            return new Promise((resolve, reject) => {
                return request.get(url, function (error, response, body) {
                    console.log('error:', error); // Print the error if one occurred
                    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                    console.log('body:', body); // Print the HTML for the Google homepage.

                    if(error) return reject(error)
                    return resolve(body)
                })
            }).then(response => {
                console.log(response);
                return done(null, {
                    '@type': 'Thing',
                    url: 'https://http://localhost:3000/gmail/actions/<id>',
                    name: 'Action succeeded',
                    description: 'more info about output of the action' 
                });
            }).catch(e => {
                return done({
                    '@type': 'Thing',
                    url: 'https://http://localhost:3000/gmail/actions/<id>',
                    name: 'Action failed',
                    description: e.message,
                    // START required by jayson
                    message: 'Action failed',
                    code: 404,
                    // END required by jayson
                })
            })
        },
        collect: true // means "collect all JSON-RPC parameters in one arg"
    })
}

/**
 * @definition 
 * {
 *    url: "<host>/rpc/gmail-actions",
 *    method: POST
 *    request: {
 *       headers: { 'Content-Type': 'application/ld+json'  },
 *       payload: {
            "jsonrpc": "2.0",
            "id": <string|number>,
            "@type": "HttpActionHandler",
            "url": "https://www.youtube.com/watch?v=rGdKmF2UzSc",
            "method": "HttpRequestMethod.GET"
        }
 *    },
 *    response: { // success
 *       status: 200,
 *       payload: {
            "@type": "Thing", // => Response/Status
            "url": "https://<host>/gmail/actions/<id>"
            "name": "Action succeeded",
            "description": "more info about output of the action"
 *       }
 *    }
  *   response: { // failure
 *       status: 500,
 *       payload: {
            "@type": "Thing", // => Response/Status
            "url": "https://<host>/gmail/actions/<id>"
            "name": "Action failed",
            "description": "reason for failure"
 *       }
 *    }
 * }
 */


var server = jayson.server(gmailActions);
server.http().listen(5000, function () {
    console.log('EGM RPC Server listening on port 5000!')
});