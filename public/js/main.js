var userObj = {
	"Ryan.dsouza@Hotmail.ca" : {
		'icon_url' : '',
		'DisplayName' : 'RyanD',
		'class' : 'rightSide'
	},
	"jasoncdu.92@gmail.com" : {
		'icon_url' : '',
		'DisplayName' : 'Help Bot',
		'class' : 'leftSide'
	}
};

var v = 1;

$(document).ready(function() {
	
	var socket = io();
	
	socket.on('getChatMessagesSuccess', function(data){
		var box = $("#chathere").empty();
		var items = data.items;
		for(var i=items.length-1; i>=0; i-=1) {
			var container = $("<div class='commentBox " + userObj[items[i].personEmail].class + "'/>");
			container.append("<div><img src='" + userObj[items[i].personEmail].icon_url + "'/>" + userObj[items[i].personEmail].DisplayName + "</div>");
			container.append("<div>" + items[i].text + "</div>");
			box.append(container);
		}
	});
	socket.on('checkFridgeLogDataSuccess', function(data) {
		socket.emit('setChatMessages', {
			'message' : data,
			'bot' : true
		});
	});
	socket.on('setChatMessagesSuccess', function(data) {
		if (data.status == 'ok') {
			socket.emit('checkFridgeLogData', {
				'v' : v
			});
			v += 1;
		}
	});


	

	
	socket.emit('getChatMessages');
	$("#refresh").click(function() {
		socket.emit('getChatMessages');
	});
	
	
	$("#submit").click(function() {
		var msg = $("#msgField").val();
		$("#msgField").val("");
		socket.emit('setChatMessages', {
			'message' : msg,
			'bot' : false
		});
	});
});