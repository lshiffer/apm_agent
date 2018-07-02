'use strict';

const express = require('express');
const fetch = require('node-fetch');
const fs = require('fs');

const measure = require('./../../classes/Measure');
var expect = require('chai').expect;
var server;

var port = process.env.APP_PORT;

describe('Integration Testing', function() {
	before(() => { 
		require('./../../');
		setupServer();
	});
	afterEach(() => { });
	after(async () => { server.close(); });

	it('Should mark GET responses with a UUID', async function() {
		let r = await fetch(process.env.SERVER_DOMAIN + ':' + port);
		expect(r.headers.get('uuid')).to.exist;
	});

	it('Should mark POST responses with a UUID', async function() {
		let r = await fetch(process.env.SERVER_DOMAIN + ':' + port, {
			method: 'POST'
		});
		expect(r.headers.get('uuid')).to.exist;
	});

	// Essentially 5 tests in one.
	/*
		1)  Are logs being created?
		2)  Is a new String object being captured (and logged)?
		3)  Are no String objects logged when none are created?
		4)  Is the memory usage being captured and logged?
		5)  Is the duration from request to response being captured and logged?
		6)  Is the UUID being logged? 

	Reason for this 5-in-1 is to read the log file once. 
	*/
	it('Should log all data (5 tests in one)', async function() {
		await fetch(process.env.SERVER_DOMAIN + ':' + port);
		measure.closeFileStream();
		let logs = await fs.readFileSync('./' + process.env.LOG_FILE_NAME);
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

	server = app.listen(port);
}