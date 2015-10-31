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
	response.writeHead(200, {'Content-type': mime.lookup(path.base-name(filePath))});
	response.end(fileContents);
};