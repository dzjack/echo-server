var ws = new WebSocket("ws://" + socketServerURI + socketServerPath + "socket");
var clientId = null;
var logger = document.getElementsByTagName("ul")[0];
var log = function(text) {
  logger.innerHTML += "<li>" + text + "</li>";
};

//client.emit('subscribeToTimer', 1000);

let toggle = true;
let button = document.getElementById("pingButton");
let circle = document.getElementById("circle");

function toggleText(button) {
  button.innerText = button.innerText === "ping" ? "stop" : "ping";
}

ws.addEventListener("open", function() {
  log("OPEN: " + ws);
  ws.send("Hello Server");
});

button.addEventListener("click", function() {
  if (toggle) {
    toggle = false;
    toggleText(button);
    return ws.send(
      JSON.stringify({ function: "subscribeToTimer", timer: "1000" })
    );
  }
  toggle = true;
  toggleText(button);
  return ws.send(JSON.stringify({ function: "unsubscribeToTimer" }));
});

ws.onmessage = function(event) {
  log("MESSAGE: " + event.data);
  switch (event) {
    case "notify":
      socketPrintNotify(result);
    case "timer":
      document.getElementById("pong").innerHTML = event.data;
    case "disconnect":
      circle.style.fill = "red";
    case "default":
      return;
  }
};

function socketPrintNotify(data) {
  document.getElementById("json").innerHTML = JSON.stringify(
    data,
    undefined,
    2
  );
}
