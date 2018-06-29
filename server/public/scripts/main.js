
var socket;

async function init() {
	socket = io.connect(':'+3200);

	socketListener();
}

function socketListener() {
	socket.on('newLog', function(data) {
		console.log(data);
	});
}