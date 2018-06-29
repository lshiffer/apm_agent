'use strict';

require('./../../instrumentation/modules/String');

const asyncHooks = require('async_hooks');
const context = require('./../../classes/Context');
const measure = require('./../../classes/Measure');
const expect = require('chai').expect;

const Agent_Data = require('./../../classes/Agent_Data');

describe('String Proxy', function() {
	beforeEach(() => {
		let test_data = new Agent_Data('123', '123', 'string');
		context.set(asyncHooks.executionAsyncId(), test_data);
		measure.start(test_data, test_data);
	});

	it('Should know a new string was created', function() {
		let string = new String("this is a string");
		expect(context.getContext().stats.strings).to.be.equal(1);
	});

	it('Should know multiple strings were created', function() {
		let string = new String("this is a string");
		let string1 = new String("This too is a string");
		let string2 = new String("And also this is a string");
		expect(context.getContext().stats.strings).to.be.equal(3);
	});

	it('Should know an emtpy string is created', function() {
		let string = new String();
		expect(context.getContext().stats.strings).to.be.equal(1);
	});

	it('Should not record a referenced string', function() {
		let string = new String("String to be referenced");
		let stringRef = string;
		expect(context.getContext().stats.strings).to.be.equal(1);
	});
});