var http = require('http');
var express = require('express');
var db = require('../src/database');
var auth = require('../src/auth');
var request_handlers = require('../src/request-handlers');

var app = express();

app.use(express.logger());
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.cookieSession({ secret: 'ijhcijwrvivelbtektjqpb' }));
app.use(express['static'](__dirname + '/../public'));

app.use(auth.session_handler);

request_handlers.register(app);

db.connect(function (err) {
	if (err) {
		throw err;
	}

	http.createServer(app).listen(3000);
});

