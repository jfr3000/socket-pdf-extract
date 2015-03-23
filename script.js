var socket = io();

function appendResponse(msg){
    el = document.querySelector('#output');
    el.innerText = msg;
}

function doStuff() {
    console.log('yay i sent something');
    socket.emit('event');
}

socket.on("connect", function(){
    console.log("Client has connected!");
});

socket.on("progress", function (progress) {
    appendResponse("Page " + progress + " has been processed.");
});

socket.on("data", function (data) {
    appendResponse(data);
});
