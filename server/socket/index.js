
var sockets = {};

sockets.init = function(io) {

	socketIO = io;

	io.on('connection', function(client) {
		client.on('new_log', function(logData) {
			sendNewLog(logData);
		});
	});
}

function sendNewLog(logData) {
	socketIO.emit('newLog', logData);
}

module.exports = sockets;