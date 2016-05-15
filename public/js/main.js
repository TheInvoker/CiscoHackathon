var userObj = {
	"Ryan.dsouza@Hotmail.ca" : {
		'icon_url' : '',
		'DisplayName' : 'RyanD'
	},
	"jasoncdu.92@gmail.com" : {
		'icon_url' : '',
		'DisplayName' : 'Help Bot'
	}
};

$(document).ready(function() {
	
	var socket = io();
	
	socket.on('getChatMessagesSuccess', function(data){
		var box = $("#chatbox").empty();
		var items = data.items;
		for(var i=items.length-1; i>=0; i-=1) {
			
			var container = $("<div class='commentBox'/>");
			container.append("<div>" + userObj[items[i].personEmail].DisplayName + "</div>");
			container.append("<div>" + items[i].text + "</div>");
			box.append(container);
		}
	});
	
	socket.on('setChatMessagesSuccess', function(data){
		
	});
	
	socket.emit('getChatMessages');
	setInterval(function() {
		socket.emit('getChatMessages');
	}, 2000);
	
	
	$("#submit").click(function() {
		var msg = $("#msgField").val();
		$("#msgField").val("");
		socket.emit('setChatMessages', {
			'message' : msg
		});
	});
});