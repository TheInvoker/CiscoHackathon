var userObj = {
	"Ryan.dsouza@Hotmail.ca" : {
		'icon_url' : '',
		'DisplayName' : 'RyanD',
		'class' : 'rightSide'
	},
	"jasoncdu.92@gmail.com" : {
		'icon_url' : 'imgs/avatar-bot.png',
		'DisplayName' : 'JasonD',
		'class' : 'leftSide'
	}
};

var v = 1;

$(document).ready(function() {
	
	var socket = io();
	
	socket.on('getChatMessagesSuccess', function(data){
		var box = $("#chathere").empty();
		var items = data.data.items;
		for(var i=items.length-1; i>=0; i-=1) {
			if (items[i].text.indexOf("Bot: ") != -1) {
				items[i].personEmail = "jasoncdu.92@gmail.com";
				items[i].text = items[i].text.substr(5);
				var displayName = "Help Bot";
			} else {
				var displayName = userObj[items[i].personEmail].DisplayName;
			}
			var container = $("<div class='commentBox " + userObj[items[i].personEmail].class + "'/>");
			container.append("<div><img src='" + userObj[items[i].personEmail].icon_url + "'/>" + "<div><div>" + displayName + "</div>" + "<div>" + items[i].text + "</div></div></div>");
			box.append(container);
		}
		box.append(data.afterhtml);
		
		$('#chatbox').scrollTop($('#chatbox')[0].scrollHeight);
	});
	socket.on('checkFridgeLogDataSuccess', function(data) {
		socket.emit('setChatMessages', {
			'message' : data.msg,
			'bot' : true,
			'afterhtml' : data.afterhtml
		});
	});
	socket.on('setChatMessagesSuccess', function(data) {
		if (data.status == 'ok') {
			if (data.bot) {
				socket.emit('getChatMessages', {
					'afterhtml' : data.afterhtml
				});
			} else {
				socket.emit('checkFridgeLogData', {
					'v' : v
				});
				v += 1;
				
				if (v == 5) {
					setInterval(function() {
						socket.emit('getChatMessages', {});
					}, 5000);
				}
			}
		}
	});
	socket.on('actionWorkedSuccess', function(data) {
		alert("Thank you for letting us know this was your fix!");
	});
	socket.on('actionNotWorkedSuccess', function(data) {
		
	});
	

	
	socket.emit('getChatMessages', {});
	$("#refresh").click(function() {
		socket.emit('getChatMessages', {});
	});
	
	
	$("#submit").click(function() {
		var msg = $("#msgField").val();
		$("#msgField").val("");
		socket.emit('setChatMessages', {
			'message' : msg,
			'bot' : false
		});
	});
	
	
	$("#chathere").on('click', '.botAction_check', function() {
		socket.emit('actionWorked');
	});
	$("#chathere").on('click', '.botAction_error', function() {
		socket.emit('actionNotWorked');
		$(this).closest(".botAction").remove();
	});
});