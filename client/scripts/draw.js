

window.onresize = function(){ location.reload(); }

var ROOM = "0";
var COLOR = "black";
var RADIUS = 10;
var prevcanvasX;
var prevcanvasY;
var postcanvasX;
var postcanvasY;

var socket, canvas, context;

function get_param(name) {
    var url = location.href;
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    console.log(results);    ;
    return results == null ? null : results[1];

}

function change_color(color)
{
    COLOR = color;
}

function increase_brush_size(size){   
    RADIUS = size;
    var pixels = document.getElementById("size1");
    pixels.value = RADIUS.toString() + " px";
}

function change_color_picker(picker)
{
    COLOR = '#' + picker.toString();
}

function get_draw(draw_data)
{
    /*draw_data["x"] = (draw_data["x"] / 1000.0) * canvas.width;
    draw_data["y"] = (draw_data["y"] / 1000.0) * canvas.height;*/    
    context.beginPath();
    context.lineWidth = draw_data["radius"];
    context.strokeStyle = draw_data["color"];
    context.lineJoin = context.lineCap = 'round';
    context.moveTo(prevcanvasX, prevcanvasY);
    context.lineTo(postcanvasX, postcanvasY);
    context.stroke();
    
}

function get_room(room_data)
{
    room_data.forEach(function (e, i) {
        get_draw(e);
    });
}

function get_clear() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function handle_message(msg)
{
    if ("room" in msg) {
        if (msg["room"] != ROOM) return;
    }
    else return;

    if (!("command" in msg)) return;

    if (msg["command"] == "draw") get_draw(msg["data"]);
    if (msg["command"] == "clear") get_clear();
    if (msg["command"] == "send_room") get_room(msg["data"]);
}

function clear_room() {
    socket.emit("message", {
        "room": ROOM,
        "command": "clear"
    });
}

var draw_enabled = false;
function mouse_paint(event)
{
    if (!draw_enabled) return;


    var rect = canvas.getBoundingClientRect();

    socket.emit("message", {
        "room": ROOM,
        "command": "draw",
        "data": {            
            "prex": prevcanvasX,
            "prey": prevcanvasY,
            "postx": postcanvasX,
            "posty": postcanvasY,
            "radius": RADIUS,
            "color": COLOR
        },
    })
}

function mouse_down(event)
{
    /*var rect = canvas.getBoundingClientRect();*/
    prevcanvasX = event.pageX - canvas.offsetLeft;
    prevcanvasY = event.pageY - canvas.offsetTop;
    
    
    draw_enabled = true;
}

function mouse_move(event)
{

    postcanvasX = event.pageX - canvas.offsetLeft;
    postcanvasY = event.pageY - canvas.offsetTop;

    if(draw_enabled){ 
        
        mouse_paint(event);
    }   
}

function mouse_up(event)
{    
    draw_enabled = false;
    
}

function downloadCanvas(link, canvas, filename) {
    link.href = canvas.toDataURL();
    link.download = filename;
}

function initialize() {
    ROOM = get_param("room");
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    var width   = window.innerWidth;
    var height  = window.innerHeight;
    canvas.width = width - 220;
    canvas.height = height - 117; 
    var compositeOperation = context.globalCompositeOperation;
    context.globalCompositeOperation = "destination-over";
    context.fillStyle = "#fff";
    context.fillRect(0,0,canvas.width,canvas.height);
    context.fill();

    context.globalCompositeOperation = compositeOperation;

    document.getElementById("download").addEventListener('click', function() {
        downloadCanvas(this, canvas, ROOM + '.png');
    }, false);

    canvas.addEventListener("mousedown", mouse_down, false);
    canvas.addEventListener("mousemove", mouse_move, false);
    canvas.addEventListener("mouseup", mouse_up, false);

    socket = io();
    socket.on("servermessage", handle_message);

    socket.emit("message", {
        "room": ROOM,
        "command": "join"
    });
}

window.addEventListener("load", initialize);

