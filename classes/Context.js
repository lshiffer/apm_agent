'use strict';

const asyncHooks = require('async_hooks');

class Context {
	constructor() {
		this.context = new Map();
	}

	init(asyncID, type, triggerAsyncID) {
		if (this.context.has(triggerAsyncID)) 
			this.context.set(asyncID, this.context.get(triggerAsyncID));
	}

	set(id, req) {
		this.context.set(id, req);
	}

	destroy(asyncID) {
		if (this.context.has(asyncID))
			this.context.delete(asyncID);
	}

	getContext(asyncID = asyncHooks.executionAsyncId()) {
		return this.context.get(asyncID);
	}

	reset() {
		this.context.clear();
	}
}

module.exports = new Context();

