var W3CWebSocket = require('websocket').w3cwebsocket;
var $ = require('jquery');

$.fn.viewer = function(name) {
    var self = this;
    var viewer = new W3CWebSocket('ws://192.168.1.100:5000/object/' + name + '/viewer', '');

    viewer.onopen = function() {
        console.log('WebSocket View Client Connected');        
    };

    viewer.onmessage = function(e) {
        self.html(name + ': ' + e.data);
    };
};

$(document).ready(function() {
    $('.message').each(function() {
        var name = $(this).data('name');
        $(this).viewer(name);
    });

    var client = new W3CWebSocket('ws://192.168.1.100:5000/object/jollen/send', '');
     
    client.onopen = function() {
        console.log('WebSocket Send Client Connected');
     
        function sendNumber() {
            var number = Math.round(Math.random() * 0xFFFFFF);
            client.send(number.toString());
            console.log('Sending... ' + number.toString());
            setTimeout(sendNumber, 3000);
        }
        sendNumber();
    };
});
