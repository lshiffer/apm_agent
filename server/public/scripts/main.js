
var socket;

async function init() {
	let port = await fetch('/socketPort');
	port = await port.text();
	socket = io.connect(':'+port);

	socketListener();
}

function socketListener() {
	socket.on('newLog', function(data) {
		let output = `<div class="label uuid">` + data.uuid + `</div>
					<div class="label dateTime">` + data.dateTime + `</div>
					<div class="label method">` + data.method + `</div>
					<div class="label url">` + data.url + `</div>
					<div class="label duration">` + data.duration + `</div>
					<div class="label strings">` + data.stats.strings + `</div>
					<div class="label memoryUsage">` + data.stats.memoryUsage + `</div>
					<br style="clear:both"/>`;
		let container = document.getElementById('events');
		container.innerHTML = output + container.innerHTML;
	});
}