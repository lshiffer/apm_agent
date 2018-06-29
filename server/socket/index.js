
var sockets = {};

sockets.init = function(io) {

	socketIO = io;

	io.on('connection', function(client) {
		console.log('Client connected...');

		client.on('new_log', function(logData) {
			console.log(logData);
			sendNewLog(logData);
		});
	});
}

function sendNewLog(logData) {
	console.log(logData);
	socketIO.emit('newLog', logData);
}

module.exports = sockets;