$(document).ready(function () {

    document.getElementById("sendButton").addEventListener("click", function (event) {

        //var user = document.getElementById("userInput").value;
        var message = document.getElementById("messageInput").value;
        Application.connection.invoke("SendMessage", Application.username, message).catch(function (err) {
            return console.error(err.toString());
        });

        event.preventDefault();

    });

    document.getElementById("drawButtonStart").addEventListener("click", function (event) {
        Application.canvas.isDrawingMode = true;
        console.log("inside drawButtonStart event handler, calling ServerSide SendDrawing method...")
        Application.connection.invoke("SendDrawingPersistent", Application.username, drawing).catch(function (err) {
            return console.error(err.toString());
        });

        event.preventDefault();
    });

    Application.canvas.on('mouse:down', function (event) {
        Application.isBrushDown = true;
        console.log("mousedown: coordinates:" + event.e.clientX + ", " + event.e.clientY);
        // handleMouseDown(user, this.getPointer(event.e));
        console.log("Stringify getPointer: " + JSON.stringify(this.getPointer(event.e)))
        Application.connection.invoke("SendMouseDown", "platypus", JSON.stringify(this.getPointer(event.e)));

    });

    Application.canvas.on('mouse:move', function (event) {
        if (!Application.isBrushDown) {
            return;
        }
        console.log("inside mouse:move... coordinates: " + event.e.clientX + ", " + event.e.clientY);
        Application.connection.invoke("SendMouseMovement", "platypus", JSON.stringify(this.getPointer(event.e)));
    })

    Application.canvas.on('mouse:up', function (event) {
        Application.isBrushDown = false;
        console.log("mouseup: coordinates: " + event.e.clientX + ", " + event.e.clientY);
        //handleMouseUp(this.getPointer(event.e));

    });
});