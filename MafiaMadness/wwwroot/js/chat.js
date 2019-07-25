﻿"use strict";

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
    console.log("inside receive drawing persistent");
    canvas.renderAll();
});



