'use strict';
require('dotenv').config({
	path: __dirname+'/.env'
});

/*
	TO RUN WITH SERVER
		node -r ./agent/index index.js
*/

const { spawn } = require('child_process');

const sub = spawn(process.argv[0], [__dirname + '/server'], {
	cwd: __dirname+'/server',
	env: process.env
});

const asyncHooks = require('async_hooks');
const context = require('./classes/Context');
const instrumentation = require('./instrumentation/index');

process.agent = process.agent || {};

const hook = asyncHooks.createHook({
	init(asyncID, type, triggerAsyncID) {
		context.init(asyncID, type, triggerAsyncID);
	},
	destroy(asyncID) {
		context.destroy(asyncID);
	}
});

hook.enable();