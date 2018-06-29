'use strict';

const Module = require('module');
const hooks = require('./hooks');

const load = Module._load;

Module._load = function(request, parent) {
	const res = load.apply(this, arguments);

	if (hooks.hasOwnProperty(request)) {
		return hooks[request](res);
	}

	return res;
}