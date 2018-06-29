
const routes = require('express').Router();

routes.get('/', (req, res) => res.sendFile('index.html', {root: __dirname + '/../views'}));

module.exports = routes;