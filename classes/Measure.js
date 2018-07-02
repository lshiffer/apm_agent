'use strict';

const Fs = require('fs');
const Path = require('path');
const io = require('socket.io-client');
const socket = io.connect('http://localhost:'+process.env.SOCKET_PORT);

const LOG_FILE_NAME = process.env.LOG_FILE_NAME;

class Measure {
	constructor() {
		this.measures = new WeakMap();
		this.startFileStream();

		process.on('beforeExit', this.preExitHandler.bind(this));
		process.on('SIGINT', this.preExitHandler.bind(this));
	}

	startFileStream() {
		this.output = Fs.createWriteStream(__dirname + '/../' + LOG_FILE_NAME);
		this.output.write('[\n');
	}

	start(req, data) {
		this.measures.set(req, data);
	}

	stop(req) {
		let data = this.measures.get(req);
		this.measures.delete(req);
		this.output.write(JSON.stringify(data) + ',\n');
		socket.emit('new_log', data);
	}

	get(context) {
		return this.measures.get(context);
	}

	closeFileStream() {
		this.output.write(']');
		this.output.end();
	}

	preExitHandler() {
		this.closeFileStream();

		process.exit();
	}
}

module.exports = new Measure();