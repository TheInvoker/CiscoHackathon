var https = require('https');
var http = require('http');
var fs = require('fs');
var qs = require("querystring");
var request = require('request');

var ZUES_TOKEN = "8fea82fd";
var SPARK_PERSONAL_ACCESS_TOKEN = 'YjM2ZmYwY2QtYzBmZS00ZGUxLTlkMWItODc3MzliODI3NmE1OGNjYjA1OGQtYTBj';

function writeCiscoData(chunk, cb) {
	writeJSON('out.txt', JSON.stringify(JSON.parse(chunk.toString()), null, 4), cb);
}
function writeJSON(file, json, cb) {
	fs.writeFile(file, json, function(err) {
		if(err) {
			return console.log(err);
		}
		cb();
	}); 
}

function readLogFromZues(cb) {
	var post_req = http.request({
		host: 'api.site1.ciscozeus.io',
		path: '/logs/' + ZUES_TOKEN + '/',
		//port: 80,
		method: 'GET',
		headers: {
			'Content-type' : 'application/x-www-form-urlencoded'
		}
	}, function(res) {
		console.log(1);
		res.on('data', function (chunk) {
			console.log(2);
			cb(chunk);
		});
	});
	post_req.write(JSON.stringify({
		"attribute_name" : 'TEST'
	}));
	post_req.on('error', function(e) {
		console.log(3);
		console.error(e);
	});
	post_req.end();
}
function sendLogToZues(logName, cb) {
	var options = { 
		method: 'POST',
		url: 'http://api.site1.ciscozeus.io/logs/'+ZUES_TOKEN+'/'+logName+'/',
		headers: { 
			'content-type': 'application/x-www-form-urlencoded',
			'cache-control': 'no-cache' 
		},
		form: { 
			logs: '[{"test":"value1"}]' 
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
		res.on('data', function (chunk) {
			var data = JSON.parse(chunk.toString()).items;
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
function writeMessage(item, msg, cb) {
	var post_req = https.request({
		host: 'api.ciscospark.com',
		path: '/v1/messages',
		method: 'POST',
		headers: {
			'Authorization': 'Bearer ' + SPARK_PERSONAL_ACCESS_TOKEN,
			'Content-type' : 'application/json; charset=utf-8'
		}
	}, function(res) {
		res.on('data', function (chunk) {
			//writeCiscoData(chunk, function() {});
			var data = JSON.parse(chunk.toString());
			cb(data);
		});
	});
	post_req.write(JSON.stringify({
		"roomId" : item.id,
		"text" : msg
	}));
	post_req.on('error', function(e) {
		console.error(e);
	});
	post_req.end();
}



/*
getRoom("Jason", "direct", function(item) {
	writeMessage(item, "XYZ", function(data) {
	});
});
*/

/*
readLogFromZues(function(data) {
	console.log(data);
});
*/




sendLogToZues("TEST123", function(data) {
	console.log(data);
});


