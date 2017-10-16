'use strict'
let request = require('request')

const HttpRequestMethod = {
	GET: 'HttpRequestMethod.GET',
};

// url used can access this server
exports.config = {
    HOST: 'http://localhost:3000'
}

exports[HttpRequestMethod.GET] = function getMethod(app) {
    app.post('/' + HttpRequestMethod.GET, function(req, res) {
        let { url } = req.body;
        
        return new Promise((resolve, reject) => {
            return request.get(url, function (error, response, body) {
                // console.log('error:', error); // Print the error if one occurred
                // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                // console.log('body:', body); // Print the HTML for the Google homepage.

                if(error) return reject(error)
                return resolve(body)
            })
        }).then(response => {
            console.log(response);
            let result = {
                '@type': 'Thing',
                url: 'https://http://localhost:3000/gmail/actions/<id>',
                name: 'Action succeeded',
                description: 'more info about output of the action' 
            }
            return res.send({ result })
        }).catch(e => {
            // console.log(e);
            let error = {
                '@type': 'Thing',
                url: 'https://http://localhost:3000/gmail/actions/<id>',
                name: 'Action failed',
                description: e.message,
                // START required by jayson
                message: 'Action failed',
                code: 404,
                // END required by jayson
            }
            return res.status(200).send({ error })            
        })

    });
}
