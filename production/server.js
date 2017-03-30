var express = require('express');
var http = require('http');
var path = require('path');
var reload = require('reload');
var bodyParser = require('body-parser');
var logger = require('morgan');
var app = express();
console.log(express.static(__dirname + '/'));
app.use(express.static(__dirname + '/')); //__dir and not _dir
var port = 8000; // you can use any port
var address = "127.0.0.1";
var server = http.createServer(app);
reload(server, app);
server.listen(port, address);
console.log("directory:", __dirname + '/');
console.log('server on ', address, ":", port);