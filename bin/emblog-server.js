var http = require('http');
var express = require('express');
var moment = require('moment');
var templates = require('../src/templates');

var app = express();

app.use(express.logger());
app.use(express['static'](__dirname + '/../public'));

app.get('/', function (req, res) {
	res.send(templates.page({
		user: null,
		body: templates.posts({
			posts: [
				{
					title: 'How to make the world better?',

					body: 'Lorem ipsum humanitarianism...',

					on: moment('10/26/2013').unix(),

					author: {
						name: 'Guilherme',
						email: 'super.driver.512@gmail.com'
					}
				}
			]
		})
	}));
});

http.createServer(app).listen(3000);

