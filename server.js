var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000);

app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
	response.sendFile(__dirname + '/index.html');
});

var players = [];
var playerSocketId = [];

io.on('connection', function(socket) {
	console.log('A connection has been made!');

	socket.on('setplayer', function(message) {
		players.push({
			name: message.name,
			score: 0,
			canvas: 0,
		});
		
		playerSocketId.push({
			socketid: socket.id,
			name: message.name,
		});	

		console.log('User Connected: name: ' + message.name);
	});

	socket.on('updatescore', function(message) {

		players.forEach(function(item) {
			if (item.name == message.name){
				item.score = message.score;
				item.canvas = message.canvas;
			}
		});
	});

	socket.on('disconnect', function () {

		// If Disconnected we remove the box from array
		// Get the box name using socketid in array playerSocketId
		playerSocketId.forEach(function(item1, index1) {
			if (item1.socketid == socket.id){
				players.forEach(function(item2, index2) {
					if (item1.name == item2.name){
						playerSocketId.splice(index1, 1);
						players.splice(index2, 1);					
						console.log('User Disconnected: name: ' + item2.name);
					}
				});
			}
		});	

	});

});

setInterval(function(){
	io.emit('getplayers', players);
}, 1000 / 30);