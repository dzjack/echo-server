var client = io(socketServerURI,{ path: socketServerPath}), clientId = null;

client.on('register', function(id) {
    clientId = id;
    console.log("ws id: " + id );
    document.getElementById('wsId').innerText = id
});

client.on('notify', function(result) {
    console.log(result);
    socketPrintNotify(result);
});

function socketPrintNotify(data){
    document.getElementById("json").innerHTML = JSON.stringify(data, undefined, 2);
}