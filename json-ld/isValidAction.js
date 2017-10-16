'use strict'
const jsonld = require('jsonld');
const ldvalidate = require('ld-validate');
const { schemas, context } = require('./config')
const { Action } = schemas

/**
 * check to see if the provided input data is a valid JSON-LD action object
 * @param {[key: string]: string | { [key: string]: string }} input
 * @param {Function} done callback to be executed after success or error 
 */
exports.isValidAction = function(input, done) {
    console.assert(typeof done === 'function', 'done is a function')
    return jsonld.expand(input, (e, expanded) => {
        if(e) return done(e, false)
        // console.log(JSON.stringify(expanded));
        const validate = ldvalidate(schemas, context)
        return validate(Action, expanded, e => {
            if(e) return done(e, false)
            return done(null, true)
        })
    })
}