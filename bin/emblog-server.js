var http = require('http');
var express = require('express');
var db = require('../src/database');
var request_handlers = require('../src/request-handlers');

var app = express();

app.use(express.logger());
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.cookieSession({ secret: 'ijhcijwrvivelbtektjqpb' }));
app.use(express['static'](__dirname + '/../public'));

request_handlers.register(app);

db.connect(function (err) {
	if (err) {
		throw err;
	}

	http.createServer(app).listen(3000);
});

