"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

//define all shapes and canvas as globals 
var canvas; 
var rect;
var initialized = false;
var brush;

//logic variables
var isBrushDown = false;

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
    /* connection.invoke("SendDrawingPersistent", user, drawing).catch(function (err) {  //not needed since we don't want to send Path anymore
        return console.error(err.toString());
    }); */
    
    event.preventDefault();
});

//no longer used
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

    canvas.on('mouse:down', function (event) {
        isBrushDown = true;
        console.log("mousedown: coordinates:" + event.e.clientX + ", " + event.e.clientY);
       // handleMouseDown(user, this.getPointer(event.e));
        console.log("Stringify getPointer: " + JSON.stringify(this.getPointer(event.e)))
        connection.invoke("SendMouseDown", "platypus", JSON.stringify(this.getPointer(event.e)));

    });

    canvas.on('mouse:move', function (event) {
        if (!isBrushDown) {
            return;
        }
        console.log("inside mouse:move... coordinates: " + event.e.clientX + ", " + event.e.clientY);
        connection.invoke("SendMouseMovement", "platypus", JSON.stringify(this.getPointer(event.e)));
    })

    canvas.on('mouse:up', function (event) {
        isBrushDown = false;
        console.log("mouseup: coordinates: " + event.e.clientX + ", " + event.e.clientY);
        //handleMouseUp(this.getPointer(event.e));

    })

    /*canvas.on('path:created', function (e) {
        console.log("inside path:created clientside event");
        var createdPath = e.path;
        console.log(createdPath.toString());
        console.log("path data: " + e.path);
        connection.invoke("SendDrawingPersistent", "platypus", JSON.stringify(e.path)).catch(function (err) {
            return console.error(err.toString());
        });
    }); */

    connection.on("ReceiveMouseDown", function (user, coordinate) {

        console.log("inside receive mouse down: " + coordinate);
        var coordinateObject = JSON.parse(coordinate);
        console.log('coordinateObject is: ' + coordinate);

        brush = new fabric.PencilBrush(canvas);
        brush.onMouseDown(coordinateObject);

        canvas.renderAll();
    });

    connection.on("ReceiveMouseMovement", function (user, coordinate) {
        console.log("inside receivemouseMove: " + coordinate);
        brush.onMouseMove(JSON.parse(coordinate));
        canvas.renderAll();
    });

    connection.on("ReceiveMouseUp", function (user, coordinate) {
        console.log("inside receive mouse up: " + coordinate);
        brush.onMouseDown(JSON.parse(coordinate));
        canvas.renderAll();
    })

    function handleMouseDown(user, point) {
        brush = new fabric.PencilBrush(canvas);;
        connection.invoke
        brush.onMouseDown(point);
    }

    function handleMouseDrag(point) {
        brush.onMouseMove(point);

    }

    function handleMouseUp(point) {
        console.log("handling mouseup...");
        brush.onMouseUp(point);

        //delete brush;
    }

});



