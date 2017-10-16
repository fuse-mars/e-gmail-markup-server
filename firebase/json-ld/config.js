'use strict'

// validation object
const HttpActionHandler = {
	type: {
		ldquery: '> @type',
		type: 'string',
		required: true,
		range: 'HttpActionHandler',
	},
	url: {
		ldquery: '> url @id',
		type: 'string',
		required: true,
	},
	method: {
		ldquery: '> method @value',
		type: 'string', // TODO use enum
		required: true,
	},
};

const Action = {
	type: {
		ldquery: '> @type',
		type: 'string',
		required: true,
		range: 'Action',
	},
	name: {
		ldquery: '> name @value',
		type: 'string',
		required: true,
	},
	instrument: {
		ldquery: '> instrument @value',
		type: 'string',
		required: true,
		min: 1,
		max: 1,
	},
	handler: {
		ldquery: '> handler',
		type: 'object',
		required: true,
		min: 1,
		max: 1,
		schema: 'HttpActionHandler',
	},
};

exports.context = { '@vocab': 'http://schema.org/' };
exports.schemas = {
	Action, HttpActionHandler
} 