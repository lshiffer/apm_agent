'use strict';

const express = require('express');
const fetch = require('node-fetch');
const fs = require('fs');

const measure = require('./../../classes/Measure');
var expect = require('chai').expect;
var server;

describe('Integration Testing', function() {
	before(() => { 
		require('./../../');
		setupServer();
	});
	afterEach(() => { });
	after(async () => { server.close(); });

	it('Should mark GET responses with a UUID', async function() {
		let r = await fetch('http://localhost:3000');
		expect(r.headers.get('uuid')).to.exist;
	});

	it('Should mark POST responses with a UUID', async function() {
		let r = await fetch('http://localhost:3000', {
			method: 'POST'
		});
		expect(r.headers.get('uuid')).to.exist;
	});

	// Essentially 6 tests in one.
	it('Should log all data (6 tests in one)', async function() {
		await fetch('http://localhost:3000');
		measure.closeFileStream();
		let logs = await fs.readFileSync('./agent_log.json');
		let data = JSON.parse(await logs.toString('utf8').slice(0, -2) + "]");
		expect(data[data.length-1].stats.strings).to.be.equal(1);
		expect(data[data.length-2].stats.strings).to.be.equal(0);
		expect(data[data.length-1].stats.memoryUsage).to.exist;
		expect(data[data.length-1].duration).to.exist;
		expect(data[data.length-1].uuid).to.exist;
	});
});

function setupServer() {
	let app = express();
	app.get('/', function(req, res) {
		let testString = new String("testing");
		res.status(200).send('ok');
	});

	app.post('/', function(req, res) {
		res.status(200).send('ok');
	});

	server = app.listen(3000);
}