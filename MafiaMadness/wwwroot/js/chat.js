"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

//define all shapes and canvas as globals 
var canvas; 
var rect;
var initialized = false;

//Disable send button until connection is established
document.getElementById("sendButton").disabled = true;

connection.on("ReceiveMessage", function (user, message) {
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var encodedMsg = user + " says " + msg;
    var li = document.createElement("li");
    li.textContent = encodedMsg;
    document.getElementById("messagesList").appendChild(li);

    canvas = new fabric.Canvas('mainCanvas');
    // create a rectangle object
    rect = new fabric.Rect({
        left: 100,
        top: 100,
        fill: 'red',
        width: 20,
        height: 20,
    });

    // "add" rectangle onto canvas
    canvas.add(rect);
});

connection.start().then(function () {
    document.getElementById("sendButton").disabled = false;
    

}).catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    var user = document.getElementById("userInput").value;
    var message = document.getElementById("messageInput").value;
    connection.invoke("SendMessage", user, message).catch(function (err) {
        return console.error(err.toString());
    });

    event.preventDefault();

});

document.getElementById("drawButtonStart").addEventListener("click", function (event) {
    canvas.isDrawingMode = true;
    console.log("inside drawButtonStart event handler, calling ServerSide SendDrawing method...")
    connection.invoke("SendDrawingPersistent", user, drawing).catch(function (err) {
        return console.error(err.toString());
    });
    
    event.preventDefault();
});

connection.on("ReceiveDrawingPersistent", function (user, drawing) {
    console.log('user', user);
    console.log('drawing', drawing);
    // Parse the canvas object back into a javascript object
    canvas.renderAll(JSON.parse(canvas)); // <-- this doesn't work, but I think this is what you would do to load the canvas data and render it
    
    
    // canvas.isDrawingMode = true;
    // console.log("inside receive drawing persistent");
    // canvas.renderAll();
});

// Just a faked event to get around the unknown 'ondraw' event handler. Once this is clicked, it will send the canvas object (stringified) to the server, then the client
document.getElementById('sendDrawing').addEventListener('click', function(e) {
    connection.invoke("SendDrawingPersistent", 'test', JSON.stringify(canvas)).catch(function (err) {
        return console.error(err.toString());
    });
});



asdf