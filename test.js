var qs = require("querystring");
var http = require("http");

var options = {
  "method": "POST",
  "hostname": "api.site1.ciscozeus.io",
  "port": null,
  "path": "/logs/8fea82fd/TEST/",
  "headers": {
    "cache-control": "no-cache",
    "postman-token": "9f5b80ea-03c8-aefd-5ed9-7e984d4f6a38",
    "content-type": "application/x-www-form-urlencoded"
  }
};

var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});

req.write(qs.stringify({ logs: '[{"test":"value1"}]' }));
req.end();