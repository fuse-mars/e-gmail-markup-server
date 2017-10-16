'use strict';
/**
 * Handling request sent from Gmail Client by "e-gmail-markup" chrome-extension
 * source: https://bcb.github.io/jsonrpc/node
 */
var express = require('express');
var bodyParser = require('body-parser');
let request = require('request')
var { isValidAction } = require('./json-ld');
var cors = require('cors');

const HttpRequestMethod = {
	GET: 'HttpRequestMethod.GET',
};
const RF = require('./rpc')
const { config: { HOST } } = RF;

var counter = 1;
function getNextId() {
	return counter++;
}



function processJSONLDFIRERequest(req, res) {
	// @TODO research on how to validate json-ld data
	// make request to rcp server
	let reqBody = req.body;
	let { handler } = reqBody;

	let id = getNextId();
	handler = Object.assign({}, handler, { jsonrpc: '2.0', id });

    let url = HOST + '/' + handler.method
    let headers = { 'content-type': 'application/json' }
    let body = JSON.stringify(handler)
    
    request.post({url, headers, body}, function(err, resp, body) {
        let json = JSON.parse(body || '{}')
        console.log(typeof json)

        let { result, error } = json
        if(err) error = err

		let handler = undefined;
        let actionStatus = "CompletedActionStatus"
        let status = error? 500: 200;

		let response = Object.assign({}, reqBody, error ? { error } : { result, actionStatus }, { handler });
		// console.log(error);
		return res.status(status).send(response);


	});
}

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
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
                "url": "https://www.example.com/ignore?hash=rGdKmF2UzSc",
                "method": "HttpRequestMethod.GET"
            }
        }
 *    },
 *    response: {
 *       headers: { 'Content-Type': 'application/ld+json'  },
 *       payload: {
            "@context": "http://schema.org",
            "@type": "SaveAction",
            "actionStatus": "CompletedActionStatus",
            "name": "Ignore Person",
            "result": {
                "@type": "Thing", // => Response/Status
                "url": "https://<host>/gmail/actions/<id>"
                "name": "Action succeeded",
                "description": "more info about output of the action"
            },
            "error": {
                "@type": "Thing",
                "url": "https://<host>/gmail/actions/<id>"
                "name": "Action failed",
                "description": "reason for failure"
            }
        }
 *    },
 * }
 */

 // rpc firebase routes
RF[HttpRequestMethod.GET](app)

app.use(function validateJSONLDAction(req, res, next) {
	let jsonld = req.body;
	return isValidAction(jsonld, function(e, isValid){
		if(isValid) return next()
		let message = e.message
		return res.status(400).send({ message })
	})
})

let corsOptions = { origin: ['chrome-extension://gaoamhnmggdidckegbfdpeaojojfmmdo']}
app.post('/gmail/actions', cors(corsOptions), processJSONLDFIRERequest);



app.listen(3000, function() {
	console.log(`EGM Main Server accessible on ${HOST}!`);
});
