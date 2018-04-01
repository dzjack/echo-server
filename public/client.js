var client = io(socketServerURI, {
  path: socketServerPath,
  transports: ["websocket"],
  wsEngine: "ws"
});
var clientId = null;

//client.emit('subscribeToTimer', 1000);

let toggle = true;

document.getElementById("pingButton").addEventListener("click", function() {
  if (toggle) {
    toggle = false;
    return client.emit("subscribeToTimer", 1000);
  }
  toggle = true;
  return client.emit("unsubscribeToTimer");
});

client.on("register", function(id) {
  clientId = id;
  console.log("ws id: " + id);
  document.getElementById("wsId").innerText = id;
});

client.on("notify", function(result) {
  console.log(result);
  socketPrintNotify(result);
});

client.on("timer", function(result) {
  document.getElementById("pong").innerHTML = result;
});

function socketPrintNotify(data) {
  document.getElementById("json").innerHTML = JSON.stringify(
    data,
    undefined,
    2
  );
}
