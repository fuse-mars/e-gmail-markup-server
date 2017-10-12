'use strict'
/**
 * Handling request sent from Gmail Client by "e-gmail-markup" chrome-extension
 * source: https://bcb.github.io/jsonrpc/node
 * 
 */
var express = require('express');
var bodyParser = require('body-parser');
var jayson = require('jayson');

// from Google
const HttpRequestMethod = {
    GET: 'HttpRequestMethod.GET'
}

var gmailActions = {
    [HttpRequestMethod.GET]: function(args, callback) {
        console.log(args);
        callback(null, { ok: true });
    }
}

var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

/**
 * @definition 
 * {
 *    url: "<host>/rpc/gmail-actions",
 *    method: POST
 *    request: {
 *       headers: { 'Content-Type': 'application/ld+json'  },
 *       payload: {
            "@context": "http://schema.org",
            "@type": "SaveAction",
            "name": "Ignore Person",
            "handler": {
                "@type": "HttpActionHandler",
                "url": "https://www.youtube.com/watch?v=rGdKmF2UzSc",
                "method": "HttpRequestMethod.GET"
            }
        }
 *    },
 *    response: {
 *       @TODO
 *    }
 * }
 */
app.post('/rpc/gmail/actions', jayson.server(gmailActions).middleware());

app.listen(5000);