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

Application.userCount = 0;

//Disable send button until connection is established
document.getElementById("sendButton").disabled = true;



$(document).ready(function () {
    console.log("inside document ready");

    Application.connection.start().then(function () {
        document.getElementById("sendButton").disabled = false;
    }).catch(function (err) {
        return console.error(err.toString());
    });

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

    $(document).hover(function () {
        console.log("hovering body");
    })

    $(document).on("click", "#inputNameButton", function (e) {
        //alert($("#inputNameField").val());
        Application.username = $("#inputNameField").val();
        $('#nameModal').hide();
        window.setInterval(function () {
            Application.connection.invoke("RequestUserCount", Application.username).catch(function (err) {
                console.log("inside window.SetInterval request user count");
                return console.error(err.toString());
            });
        }, 1000);
    });

    Application.connection.on("RequestUserCount", function (count) {

        console.log("inside requestUserCount, count is: " + count);
        Application.userCount = count;
    });
});