'use strict';
const input = {
	'@context': 'http://schema.org',
	'@type': 'Action',
	name: 'Ignore Person',
	instrument: 'ignore-person-1',
	handler: {
		'@type': 'HttpActionHandler',
		url:
			'https://mandrillapp.com/track/click/30730776/annadev.fusemachines.com?p=eyJzIjoiWEttQUN6S1VxRmhBdlFFYmpSM1F6MkFJVEswIiwidiI6MSwicCI6IntcInVcIjozMDczMDc3NixcInZcIjoxLFwidXJsXCI6XCJodHRwczpcXFwvXFxcL2FubmFkZXYuZnVzZW1hY2hpbmVzLmNvbVxcXC9wdWJsaWNcXFwvaWdub3JlXFxcL3BlcnNvbi5odG1sIzU5ZTA4NDE2NjRkNjU3NzAwMGY1Y2UwOFwiLFwiaWRcIjpcIjQ0ZjI4OTU4MDA1MDQ5ZmE5YjAyOWRkNTM5OTIxZTM3XCIsXCJ1cmxfaWRzXCI6W1wiMTcxZjQ1ZGZiNjdmOTQzYWExZTE4YzE5OTlmODZlYWVlM2FiMzA4MVwiXX0ifQ',
		method: 'HttpRequestMethod.GET',
	},
};

// validation object
let HttpActionHandler = {
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
const schema = {
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

const jsonld = require('jsonld');
const ldvalidate = require('ld-validate');

jsonld.expand(input, (e, expanded) => {
	console.log(JSON.stringify(expanded));
	const context = { '@vocab': 'http://schema.org/' };
	const validate = ldvalidate({ schema, HttpActionHandler }, context);
	validate(schema, expanded, e => {
		if (e) {
			console.error(e);
		} else {
			console.log('Validated ok');
		}
	});
});
