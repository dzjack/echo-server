require("dotenv").config();

const express = require("express");
const app = express();

const http = require("http");
const server = http.createServer(app);

let sequenceNumberByClient = new Map();

const io = require("socket.io")(server, {
  path: process.env.API_END_POINT + "/socket.io",
  transports: ["websocket", "polling"]
});

const uuid = require("node-uuid");
const fs = require("fs");
const parse = require("url-parse");

const bodyParser = require("body-parser");

var jsonParser = bodyParser.json();

// io.on("connection", function(socket) {
//   socket.emit("register", socket.id);
//   var referer = socket.request.headers;
//   var clientIP = socket.handshake.address;
//   socket.emit("notify", referer);
//   socket.emit("clientip", clientIP);

//   socket.on("ping", function(socket) {
//     console.log("ping");
//     socket.emit("pong");
//   });
//   socket.on("disconnect", function() {
//     console.log("disconnect");
//   });
// });

io.on("connection", function(client) {
  console.info(`Client connected [id=${client.id}]`);
  // initialize this client's sequence number
  client.emit("register", client.id);
  var referer = client.request.headers;
  var clientIP = client.handshake.address;
  client.emit("notify", referer);
  client.emit("clientip", clientIP);
  var intervalId = false;
  sequenceNumberByClient.set(client, 1);
  client.on("subscribeToTimer", interval => {
    console.log("client is subscribing to timer with interval ", interval);
    intervalId = setInterval(() => {
      return client.emit("timer", new Date());
    }, interval);
  });
  client.on("unsubscribeToTimer", () => {
    clearInterval(intervalId);
  });
});

app.use(process.env.API_END_POINT + "/static", express.static("public"));

app.get(process.env.API_END_POINT, function(req, res) {
  console.log(req.url);
  res.writeHead(200, { "Content-Type": "text/html" });
  fs.createReadStream("index.html").pipe(res);
});

server.listen(process.env.API_PORT, function() {
  console.log("App started!");
});
