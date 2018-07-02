'use strict';

require('./../../instrumentation/modules/HttpServerEmit');
const express = require('express');

const context = require('./../../classes/Context');
const fetch = require('node-fetch');

var expect = require('chai').expect;
var server;

var port = process.env.APP_PORT;

describe('HTTP Server Emit', function() {
	before(() => { server = express().listen(port); });
	afterEach(() => { context.reset(); });
	after(() => { server.close(); });

	it('Should know a new GET request came in', async function() {
		await fetch('http://localhost:' + port);
		expect(context.context.values().next().value).to.have.own.property('agent');
	});

	it('GET response should have a UUID', async function() {
		await fetch('http://localhost:' + port);
		expect(context.context.values().next().value.agent).to.have.own.property('uuid');
	});

	it('Should know if multiple GET requests came in', async function() {
		fetch('http://localhost:' + port);
		fetch('http://localhost:' + port);
		await fetch('http://localhost:' + port);
		expect(context.context.size).to.be.equal(3);
	});

	it('Should know a new POST request came in', async function() {
		await fetch('http://localhost:' + port, {
			method: 'POST'
		});
		expect(context.context.values().next().value).to.have.own.property('agent');
	});

	it('POST response should have a UUID', async function() {
		await fetch('http://localhost:' + port, {
			method: 'POST'
		});
		expect(context.context.values().next().value.agent).to.have.own.property('uuid');
	});

	it('Should know if multiple GET requests came in', async function() {
		fetch('http://localhost:' + port, {
			method: 'POST'
		});
		fetch('http://localhost:' + port, {
			method: 'POST'
		});
		await fetch('http://localhost:' + port, {
			method: 'POST'
		});
		expect(context.context.size).to.be.equal(3);
	});

	it('Should know if multiple GET/POST requests came in', async function() {
		fetch('http://localhost:' + port, {
			method: 'POST'
		});
		fetch('http://localhost:' + port, {
			method: 'POST'
		});
		fetch('http://localhost:' + port);
		await fetch('http://localhost:' + port);
		expect(context.context.size).to.be.equal(4);
	});
});
