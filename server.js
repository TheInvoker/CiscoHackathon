var https = require('https');
var http = require('http');
var fs = require('fs');
var request = require('request');

var ZUES_TOKEN = "8fea82fd";
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
		url: 'http://api.site1.ciscozeus.io/logs/' + ZUES_TOKEN + '/',
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
			var data = JSON.parse(body).items;
			for(var i=0; i<data.length; i+=1) {
				var item = data[i];
				if (item.title==titleFilter && item.type==typeFilter) {
					cb(item);
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
		console.error(e);
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



getRoom("Jason", "direct", function(item) {
	//writeMessage(item, "XYZ", function(data) {
	//});
	readMessages(item, function(data) {
		console.log(data);
	});
});
/*





readLogFromZues("TEST123", function(data) {
	console.log(data);
});
sendLogToZues("SSSSSSS", [{"test":"value1"}], function(data) {
	console.log(data);
});
*/
