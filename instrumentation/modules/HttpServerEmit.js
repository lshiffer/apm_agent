'use strict';
require('express');
const asyncHooks = require('async_hooks');
const http = require('http');
const perfHook = require('perf_hooks');
const uuid = require('uuid/v4');
const measure = require('./../../classes/Measure');
const context = require('./../../classes/Context');

const Agent_Data = require('./../../classes/Agent_Data.js');

const emit = http.Server.prototype.emit;

http.Server.prototype.emit = function(type) {
	if (type === 'request') {
		const [req, res] = [arguments[1], arguments[2]];
		req.agent = {};
		req.agent.uuid = uuid();
		res.setHeader('uuid', req.agent.uuid)

		perfHook.performance.mark('start - ' + req.agent.uuid);

		let data = new Agent_Data(req.agent.uuid, req.url, req.method);

		measure.start(req, data);

		res.on('finish', () => {
			data.setMemoryUsage(process.memoryUsage().heapUsed);
			perfHook.performance.mark('end - ' + req.agent.uuid);
			perfHook.performance.measure('request - ' + req.agent.uuid, 'start - ' + req.agent.uuid, 'end - ' + req.agent.uuid);
			let endMeasure = perfHook.performance.getEntriesByName('request - ' + req.agent.uuid)[0];

			perfHook.performance.clearMarks('start - ' + req.agent.uuid);
			perfHook.performance.clearMarks('end - ' + req.agent.uuid);
			perfHook.performance.clearMeasures('request - ' + req.agent.uuid);

			data.setDuration(endMeasure.duration);

			measure.stop(req);
		});

		let id = asyncHooks.executionAsyncId();
		context.set(id, req);
	}

	return emit.apply(this, arguments);
}