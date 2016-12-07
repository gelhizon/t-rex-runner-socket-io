var socket = io();
var player = {};

player.name = prompt("Please enter your name", "Harry Potter");
player.score = 0;
player.canvas = 0;

socket.emit('setplayer', player);

new Vue({
	el: '#players',

	data: {
		players: []
	},

	mounted: function() {
		socket.on('getplayers', function(message){

			// Remove myself from players
			message.forEach(function(item, index) {
				if (item.name == player.name){
					message.splice(index, 1);					
				}
			});
			
			this.players = message;
		}.bind(this));
	}
}); 