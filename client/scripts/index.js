
function btn_connect_pressed() {
    var txt_room = document.getElementById("txt_room");
    var room_name = txt_room.value;
    window.location.href = "/draw.html?room=" + room_name;    
}

$(document).ready(function(){
    $("#logo").fadeIn(1000, function () {
        $("#formmodal").fadeIn(1000, function() {
            $("#slogan").fadeIn(1000);
        });
        });
    });

document.addEventListener('DOMContentLoaded', function () {
  particleground(document.getElementById('particles'), {
    dotColor: '#000',
    lineColor: '#fff'
  });
});