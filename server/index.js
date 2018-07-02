'use strict';

const express = require('express');
const app = express();
const server = require('http').createServer(app);

const io = require('socket.io')(server);
require('./socket').init(io);

const routes = require('./routes');

app.use(express.static('./public'));
app.use('/', routes);

server.listen(process.env.SOCKET_PORT);
app.listen(process.env.APP_PORT, () => console.log('Running....'));