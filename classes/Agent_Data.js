'use strict'; 

const MEMORY_PRECISION = 4;

class Agent_Data {
	constructor(uuid, url, method) {
		this.uuid = uuid;
		this.url = url;
		this.method = method;
		this.dateTime = new Date();
		this.duration = 0;
		this.stats = {strings: 0, memoryUsage: null};
	}

	setMemoryUsage(usage) {
		this.stats.memoryUsage = (((usage / 1024 / 1024 ) * 100) / 100).toFixed(MEMORY_PRECISION) + " MB";
	}

	upStringCount() {
		this.stats.strings++;
	}

	setDuration(duration) {
		this.duration = duration;
	}
}

module.exports = Agent_Data;