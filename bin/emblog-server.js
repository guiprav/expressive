var http = require('http');
var express = require('express');

var app = express();

app.use(express.logger());
app.use(express['static'](__dirname + '/../public'));

http.createServer(app).listen(process.env.PORT || 3000);

