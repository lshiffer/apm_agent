'use strict';

const express = require('express');
const app = express();
const server = require('http').createServer(app);

const io = require('socket.io')(server);
require(__dirname + '/socket').init(io);

const routes = require('./routes');

app.use(express.static(__dirname + '/public'));
app.use('/', routes);

server.listen(3200);
app.listen(3100, () => console.log('Running....'));