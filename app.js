const http = require('http');
const express  = require('express');
const app = module.exports.app = express();
const server = http.createServer(app);
const uuid = require('node-uuid');
const fs = require('fs');
const parse = require('url-parse');
const io = require('socket.io')()
io.path('/debugcf/socket').listen(server);

const bodyParser = require('body-parser');

require('dotenv').config();

var jsonParser = bodyParser.json()

io.on('connection', function(socket) {
    socket.emit('register', socket.id);
    var referer = socket.request.headers
    socket.emit('notify', referer);
});

app.use(process.env.API_END_POINT+'/static', express.static('public'));

app.get(process.env.API_END_POINT, function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream('index.html').pipe(res);
});

server.listen(process.env.API_PORT, function () {
    console.log('App started!');
});

