var express = require('express');
var app = express();
var https = require('https');
var http = require('http');
var fs = require('fs');
var request = require('request');
var socket = require('socket.io');


var ZUES_TOKEN = "6d23d608";
var SPARK_PERSONAL_ACCESS_TOKEN = 'YjM2ZmYwY2QtYzBmZS00ZGUxLTlkMWItODc3MzliODI3NmE1OGNjYjA1OGQtYTBj';

function writeCiscoData(str, cb) {
	writeJSON('out.txt', JSON.stringify(JSON.parse(str), null, 4), cb);
}
function writeJSON(file, json, cb) {
	fs.writeFile(file, json, function(err) {
		if(err) {
			return console.log(err);
		}
		cb();
	}); 
}

function readLogFromZues(log_name, cb) {
	var options = { method: 'GET',
		url: 'http://api.site1.ciscozeus.io/logs/' + ZUES_TOKEN + '?offset=0&limit=30',
		qs: { 
			log_name: log_name
		},
		headers: { 
			'postman-token': '55e061d8-4341-ef57-a305-cf9e505e220b',
			'cache-control': 'no-cache' 
		}
	};
	request(options, function (error, response, body) {
		if (error) {
			throw new Error(error);
		}
		cb(body);
	});
}
function sendLogToZues(logName, data, cb) {
	var options = { 
		method: 'POST',
		url: 'http://api.site1.ciscozeus.io/logs/' + ZUES_TOKEN + '/' + logName + '/',
		headers: { 
			'content-type': 'application/x-www-form-urlencoded',
			'cache-control': 'no-cache' 
		},
		form: { 
			logs: JSON.stringify(data)
		} 
	};
	request(options, function (error, response, body) {
		if (error) {
			throw new Error(error);
		}
		cb(body);
	});
}
function getRoom(titleFilter, typeFilter, cb) {
	var post_req = https.request({
		host: 'api.ciscospark.com',
		path: '/v1/rooms',
		method: 'GET',
		headers: {
			'Authorization': 'Bearer ' + SPARK_PERSONAL_ACCESS_TOKEN
		}
	}, function(res) {
		var body = '';
		res.on('data', function (chunk) {
			body += chunk;
		});
		res.on('end', function() {
			var data = JSON.parse(body);
			if (data.message) {
				console.log(data.message);
			} else {
				var data = data.items;
				for(var i=0; i<data.length; i+=1) {
					var item = data[i];
					if (item.title==titleFilter && item.type==typeFilter) {
						cb(item);
					}
				}
			}
		});
	});
	post_req.on('error', function(e) {
		console.error(e);
	});
	post_req.end();
}
function writeMessage(room, msg, cb) {
	var post_req = https.request({
		host: 'api.ciscospark.com',
		path: '/v1/messages',
		method: 'POST',
		headers: {
			'Authorization': 'Bearer ' + SPARK_PERSONAL_ACCESS_TOKEN,
			'Content-type' : 'application/json; charset=utf-8'
		}
	}, function(res) {
		var body = '';
		res.on('data', function (chunk) {
			body += chunk;
		});
		res.on('end', function() {
			//writeCiscoData(body, function() {});
			cb(body);
		});
	});
	post_req.write(JSON.stringify({
		"roomId" : room.id,
		"text" : msg
	}));
	post_req.on('error', function(e) {
		console.error("Error when writing message to spark", e);
	});
	post_req.end();
}
function readMessages(room, cb) {
	var post_req = https.request({
		host: 'api.ciscospark.com',
		path: '/v1/messages?roomId=' + room.id + '&max=30',
		method: 'GET',
		headers: {
			'Authorization': 'Bearer ' + SPARK_PERSONAL_ACCESS_TOKEN,
			'Content-type' : 'application/json; charset=utf-8'
		}
	}, function(res) {
		var body = '';
		res.on('data', function (chunk) {
			body += chunk;
		});
		res.on('end', function() {
			//writeCiscoData(body, function() {});
			cb(body);
		});
	});
	post_req.on('error', function(e) {
		console.error(e);
	});
	post_req.end();
}


function createBotAction(msg) {
	var ahtml = '<div class="botAction"><div>'+msg+'</div><div><div class="botAction_check"><img src="imgs/check.png"/></div><div class="botAction_error"><img src="imgs/error.png"/></div></div></div>';
	return ahtml;
}

/*
readLogFromZues("fridge_log", function(data) {
	console.log(data);
});
sendLogToZues("SSSSSSS", [{"test":"value1"}], function(data) {
	console.log(data);
});
*/


fs.readFile('public/logs/fridge.log', function read(err, logdata) {
	if (err) {
		throw err;
	}
	
	logdata = logdata.toString();
	var sentences = logdata.split(".");
	/*
	var u = {};
	for(var i=0; i<sentences.length; i+=1) {
		
		var t = sentences[i].split(" ");
		for(var j=0; j<t.length; j+=1) {
			t[j] = t[j].trim();
		}
		if (t.length > 1) {
			sendLogToZues("fridge_log", [{"word":t.join(" ")}], function(data) {
				console.log(data);
			});
		}
	}
	*/
	
	
	//sendLogToZues("fridge_log", [{"value1" : "this is a test sentence NEW NEW", "value2" : "this is a hackathon NEW NEW"}], function(data) {
	//	console.log(data);
	//});
});






function sendSMS() {
	var post_req = https.request({
		host: 'api.tropo.com',
		path: '/1.0/sessions?action=create&token=69557842765a616b76666d736d5078506e56626252776450416c4f756555786c504d42434466487158455a62',
		method: 'GET'
	}, function(res) {
		var body = '';
		res.on('data', function (chunk) {
			body += chunk;
		});
		res.on('end', function() {
			//writeCiscoData(body, function() {});
			//cb(body);
			console.log(body);
		});
	});
	post_req.on('error', function(e) {
		console.error(e);
	});
	post_req.end();
};








//String.prototype.count=function(s1) { 
//    return (this.length - this.replace(new RegExp(s1,"g"), '').length) / s1.length;
//}

var fridgedata = {};
readLogFromZues("fridge_log", function(data) {
	fridgedata = JSON.parse(data);
});

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
	var dest = 'index.html';
	res.sendFile(dest, { root: __dirname });
});

var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('HelpHub started at http://%s:%s', host, port);
});

var io = require('socket.io').listen(server);

io.on('connection', function(socket){
	console.log('a user connected');

	socket.on('disconnect', function() {
		console.log('a user left');
	});
	
	socket.on('getChatMessages', function(cdata) {
		getRoom("Jason", "direct", function(item) {
			readMessages(item, function(data) {
				socket.emit('getChatMessagesSuccess', {
					'data' : JSON.parse(data),
					'afterhtml' : cdata.afterhtml
				});
			});
		});
	});
	
	socket.on('setChatMessages', function(data) {
		console.log("Got message intent");
		getRoom("Jason", "direct", function(item) {
			console.log("Got room");
			writeMessage(item, data.message, function(writedata) {
				console.log("wrote message");
				socket.emit('setChatMessagesSuccess', {
					'status' : 'ok',
					'bot' : data.bot,
					'afterhtml' : data.afterhtml
				});
			});
		});
	});
	
	socket.on('checkFridgeLogData', function(data) {
		fs.readFile('public/logs/fridge.log', function read(err, logdata) {
			if (err) {
				throw err;
			}
			var userFridgeLog = logdata.toString();
			
			var ahtml = '<div class="botAction"><div>blah</div><div><div class="botAction_check"><img src="imgs/check.png"/></div><div class="botAction_error"><img src="imgs/error.png"/></div></div></div>';
			

			

			var lst = fridgedata.result;
			var m = 0;
			for(var i=0; i<lst.length; i+=1) {
				var s = 0;
				for(var prop in lst[i]) {
					if (prop != "timestamp") {
						//s += userFridgeLog.count(lst[i][prop]);
					}
				}
				m = Math.max(m, s);
			}
			
			
			
			if (data.v == 1) {
				socket.emit('checkFridgeLogDataSuccess', {
					'msg' : 'Bot: Hello, what can I help you with?',
					'afterhtml' : '<div class="chatMessageInLine">Sending logs...</div>'
				});
			} else if (data.v == 2) {
				socket.emit('checkFridgeLogDataSuccess', {
					'msg' : 'Bot: ok I see, can you try restarting it?',
					'afterhtml' : createBotAction("Did it work?")
				});
			} else if (data.v == 3) {
				socket.emit('checkFridgeLogDataSuccess', {
					'msg' : 'Bot: Can you power it off for 30 seconds, and then try starting it?',
					'afterhtml' : createBotAction("Did it work?")
				});
			} else if (data.v == 4) {
				socket.emit('checkFridgeLogDataSuccess', {
					'msg' : 'Bot: Judging from the logs, it could be a problem the battery not connected properly. Can you try fixing the batteries in properly?',
					'afterhtml' : createBotAction("Did it work?")
				});
			} else {
				socket.emit('checkFridgeLogDataSuccess', {
					'msg' : 'Bot: Sorry, I couldn\'t help, I\'ll connect you to a help person... @jasoncdu@outlook.com Click <a target="_blank" href="/logs/fridge.log">here</a> for the log file for your IoT fridge.',
					'afterhtml' : ''
				});
				sendSMS();
			}

		});
	});
	
	socket.on('actionWorked', function(data) {
		fs.readFile('public/logs/fridge.log', function read(err, logdata) {
			if (err) {
				throw err;
			}
			var userFridgeLog = logdata.toString();
			
			sendLogToZues("fridge_log", [{
				"solution" : "fix batteries",
				"data" : JSON.parse(userFridgeLog)
			}], function(data) {
				socket.emit('actionWorkedSuccess', {});
			});
		});
	});
	
	socket.on('actionNotWorked', function(data) {
		socket.emit('actionNotWorkedSuccess', {});
	});
	
	socket.on('end', function(data) {
		socket.disconnect(0);
	});
});
