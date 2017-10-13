'use strict'
/**
 * Handling request sent from Gmail Client by "e-gmail-markup" chrome-extension
 * source: https://bcb.github.io/jsonrpc/node
 * 
 */
var jayson = require('jayson');

// from Google
const HttpRequestMethod = {
    GET: 'HttpRequestMethod.GET'
}

var gmailActions = {
    [HttpRequestMethod.GET]: new jayson.Method({
        handler: function(payload, done) {
            console.log(payload);
            // return done({
            //     '@type': 'Thing',
            //     url: 'https://http://localhost:3000/gmail/actions/<id>',
            //     name: 'Action failed',
            //     description: 'reason for failure',
            //     // START required by jayson
            //     message: 'Action failed',
            //     code: 404,
            //     // END required by jayson
            // });
            return done(null, {
                '@type': 'Thing',
                url: 'https://http://localhost:3000/gmail/actions/<id>',
                name: 'Action succeeded',
                description: 'more info about output of the action' 
            });
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