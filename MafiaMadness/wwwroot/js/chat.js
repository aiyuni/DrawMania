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

    canvas.isDrawingMode = true;
    console.log("inside receive drawing persistent: " + drawing);
    var pathObject = JSON.parse(drawing);
    console.log('pathobject is: ' + pathObject);

    fabric.util.enlivenObjects([pathObject], function (objects) {
        console.log("inside enliveObjects...: " + objects.toString());
        objects.forEach(function (o) {
            console.log("adding path to canvas: " + o.toString());
            canvas.add(o);
        });
    });
    canvas.renderAll();
});

$(document).ready(function () {
    console.log("inside document ready");
    canvas = new fabric.Canvas('mainCanvas');
    // create a rectangle object
    rect = new fabric.Rect({
        left: 100,
        top: 100,
        fill: 'red',
        width: 20,
        height: 20
    });

    // "add" rectangle onto canvas
    canvas.add(rect);

    $(document).click(function () {
        console.log("clicked body");
    });

    canvas.on('mouse:down', function (options) {
        console.log("mousedown: coordinates:" + options.e.clientX + ", " + options.e.clientY);
        canvas.on('mouse:move', function (event) {
            console.log("inside mouse:move... coordinates: " + event.e.clientX + ", " + event.e.clientY);
        })

    });

    canvas.on('path:created', function (e) {
        console.log("inside path:created clientside event");
        var createdPath = e.path;
        console.log(createdPath.toString());
        console.log("path data: " + e.path);
        connection.invoke("SendDrawingPersistent", "platypus", JSON.stringify(e.path)).catch(function (err) {
            return console.error(err.toString());
        });
        // ... do something with your path
    });


});



