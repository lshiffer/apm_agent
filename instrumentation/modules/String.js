'use strict';

const measure = require('./../../classes/Measure');
const context = require('./../../classes/Context');
const asyncHooks = require('async_hooks');

const STRING = String.prototype;

const handler = {
	construct: function(target, args) {
		let string =  new STRING.constructor(args);
		
		let reqData = measure.get(context.getContext());
		if (reqData)
			reqData.upStringCount();

		return string;
	}
}

String = new Proxy(String, handler);