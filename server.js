'use strict'
/**
 * Handling request sent from Gmail Client by "e-gmail-markup" chrome-extension
 * source: https://bcb.github.io/jsonrpc/node
 * 
 */
var express = require('express');
var bodyParser = require('body-parser');
var fetch = require('node-fetch');

var counter = 1;
function getNextId(){ return counter++; }

function processJSONLDRequest(req, res) {
    // @TODO research on how to validate json-ld data
    // make request to rcp server
    let { handler } = req.body
    
    let id = getNextId();
    let body = JSON.stringify(Object.assign({}, handler, { "jsonrpc": "2.0", id }));
    console.log(body)
    let method = 'POST'
    let headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    fetch('http://localhost:5000/rpc/gmail/actions', { 
        method,
        headers,
        body
    })
    .then(function(out) {
        return out.json();
    }).then(function(json) {
        console.log(json);
        return res.send(json);
    })
    // return res.send(body);
    
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
app.post('/gmail/actions', processJSONLDRequest);

app.listen(3000);