"use strict";

//A single global array to hold a bunch of 'global' variables
window.Application = {};

//create the connection
Application.connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

//define all shapes and canvas as globals 
Application.canvas;
Application.rect;
Application.initialized = false;
Application.brush;

//username
Application.username;

//logic variables
Application.isBrushDown = false;

//Disable send button until connection is established
document.getElementById("sendButton").disabled = true;

Application.connection.start().then(function () {
    document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
    });


$(document).ready(function () {
    console.log("inside document ready");
    Application.canvas = new fabric.Canvas('mainCanvas');
    // create a rectangle object
    Application.rect = new fabric.Rect({
        left: 100,
        top: 100,
        fill: 'red',
        width: 20,
        height: 20
    });

    // "add" rectangle onto canvas
    Application.canvas.add(Application.rect);
    $('#nameModal').modal('show');

    $(document).click(function () {
        console.log("clicked body");
    });

    $(document).on("click", "#inputNameButton", function (e) {
        //alert($("#inputNameField").val());
        Application.username = $("#inputNameField").val();
        $('#nameModal').hide();
    });

});