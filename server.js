var https = require('https');
var fs = require('fs');

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




getRoom("Jason", "direct", function(item) {
	writeMessage(item, "XYZ", function(data) {
	});
});



