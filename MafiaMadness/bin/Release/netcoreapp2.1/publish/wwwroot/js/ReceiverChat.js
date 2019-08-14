
/**Note: always wrap all functions in document.ready function since the global.js loads variables that are being 
 * used here within document.ready!  */

$(document).ready(function () {

    Application.connection.on("ReceiveMessage", function (user, message) {
        var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        var encodedMsg = user + ": " + msg;
        var li = document.createElement("li");
        li.textContent = encodedMsg;
        document.getElementById("messagesList").appendChild(li);

        //keep the scrollbar at the bottom after sending a new message
        var chatContent= document.querySelector('#messagesList');
        chatContent.scrollTop = chatContent.scrollHeight - chatContent.clientHeight;
    });

    Application.connection.on("ReceiveMouseDown", function (user, coordinate) {

        console.log("inside receive mouse down: " + coordinate);
        var coordinateObject = JSON.parse(coordinate);
        console.log('coordinateObject is: ' + coordinate);

        Application.brush = new fabric.PencilBrush(Application.canvas);
        Application.brush.onMouseDown(coordinateObject);

        Application.canvas.renderAll();
    });

    Application.connection.on("ReceiveMouseMovement", function (user, coordinate) {
        console.log("inside receivemouseMove: " + coordinate);
        Application.brush.onMouseMove(JSON.parse(coordinate));
        Application.canvas.renderAll();
    });

    Application.connection.on("ReceiveMouseUp", function (user, coordinate) {
        console.log("inside receive mouse up: " + coordinate);
        Application.brush.onMouseDown(JSON.parse(coordinate));
        Application.canvas.renderAll();
    });

    Application.connection.on("ReceiveUserCount", function (count) {
        console.log("inside receive user count, count: " + count);
        document.getElementById("onlineUsers").innerHTML = count;
    });

    /** this is for path updating*/
    /*
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
    */
});