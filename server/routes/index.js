
const routes = require('express').Router();

routes.get('/', (req, res) => res.sendFile('index.html', {root: './views'}));
routes.get('/socketPort', (req, res) => res.send(process.env.SOCKET_PORT));

module.exports = routes;