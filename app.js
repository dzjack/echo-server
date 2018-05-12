require("dotenv").config();

const express = require("express");
const app = express();
const WebSocket = require("ws");

const http = require("http");
const server = http.createServer(app);
const uuid = require("node-uuid");
const fs = require("fs");
const parse = require("url-parse");
const bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

let sequenceNumberByClient = new Map();

const wss = new WebSocket.Server({
  server,
  path: process.env.API_END_POINT + "/socket"
});

function IsJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

wss.on("connection", function connection(ws) {
  console.info(`Client connected [id=${ws.id}]`);

  ws.on("message", function incoming(message) {
    console.log("received: %s", message);
    let socketCall = "";
    if (IsJsonString(message)) {
      socketCall = JSON.parse(message);
    } else {
      return;
    }
    switch (socketCall.function) {
      case "subscribeToTimer":
        return handleSubscribeToTimer(parseInt(socketCall.timer));
      case "unsubscribeToTimer":
        return handleUnsubscribeToTimer()
    }
  });

  handleSubscribeToTimer = interval => {
    console.log("client is subscribing to timer with interval ", interval);
    intervalId = setInterval(() => {
      return ws.send(JSON.stringify({ response: "timer", data: new Date() }));
    }, interval);
  };

  handleUnsubscribeToTimer = () => {
    clearInterval(intervalId);
  };

  ws.send("Hello Client");
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
