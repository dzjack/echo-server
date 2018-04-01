var client = io(socketServerURI, {
  path: socketServerPath,
  transports: ["websocket"],
  wsEngine: "ws"
});
var clientId = null;

//client.emit('subscribeToTimer', 1000);

let toggle = true;
let button = document.getElementById("pingButton")
let circle = document.getElementById("circle");


function toggleText(button)  {
    button.innerText = button.innerText === "ping" ? "stop" : "ping";
 }

button.addEventListener("click", function() {
  if (toggle) {
    toggle = false;
    toggleText(button)
    return client.emit("subscribeToTimer", 1000);
    
  }
  toggle = true;
  toggleText(button)
  return client.emit("unsubscribeToTimer");
});

client.on("register", function(id) {
  clientId = id;
  console.log("ws id: " + id);
  document.getElementById("wsId").innerText = id;
  circle.style.fill = 'green'
});

client.on("notify", function(result) {
  console.log(result);
  socketPrintNotify(result);
});

client.on("timer", function(result) {
  document.getElementById("pong").innerHTML = result;
});

client.on("disconnect", function(){
    console.log("client disconnected from server");
    circle.style.fill = 'red'
});

function socketPrintNotify(data) {
  document.getElementById("json").innerHTML = JSON.stringify(
    data,
    undefined,
    2
  );
}
