var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var cache = {};

// When a file requested does not exist
var send404 = function(response) {
	response.writeHead(404, {'Content-type': 'text/plain'});
	response.write('Error 404: resource not found.');
	response.end();
};

// Serves file data, writes appropriate HTTP header then sends the contents of the file
var sendFile = function(response, filePath, fileContents) {
	response.writeHead(200, {'Content-type': mime.lookup(path.basename(filePath))});
	response.end(fileContents);
};

// Cache frequently used data in memory
var serveStatic = function(response, cache, absPath) {
	if(cache[absPath]) {
		sendFile(response, absPath, cache[absPath]);
	} else {
		fs.exists(absPath, function(exists) {
			if (exists) {
				fs.readFile(absPath, function(err, data) {
					if (err) {
						send404(response);
					} else {
						cache[absPath] = data;
						sendFile(response, absPath, data);
					}
				});
			} else {
				send404(response);
			}
		});
	}
};

// Create HTTP server
var server = http.createServer(function(request, response) {
	var filePath = false;

	if(request.url === '/') {
		filePath = 'public/index.html';
	} else {
		filePath = 'public' + request.url;
	}

	var absPath = './' + filePath;
	serveStatic(response, cache, absPath);
});

server.listen(3000, function() {
	console.log("Server listening on port 3000");
});


var chatServer = require('./lib/chat_server');
chatServer.listen(server);








