var http = require('http');
var express = require('express');
var moment = require('moment');
var db = require('../src/database');
var auth = require('../src/auth');
var templates = require('../src/templates');

var app = express();

app.use(express.logger());
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.cookieSession({ secret: 'ijhcijwrvivelbtektjqpb' }));
app.use(express['static'](__dirname + '/../public'));

app.get('/', function (req, res) {
	var user = (req.session)? req.session.user : null;

	res.send(templates.page({
		user: user,

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

app.post('/login', function (req, res) {
	auth(req.body.email, req.body.password, function (err, user_data) {
		if (err) {
			var current_user = (req.session)? req.session.user : null;

			res.send(templates.page({
				user: current_user,
				body: templates.invalid_credentials()
			}));

			return;
		}

		req.session = { user: user_data };

		res.redirect('/');
	});
});

app.get('/logout', function (req, res) {
	req.session = null;
	res.redirect('/');
});

db.connect(function (err) {
	if (err) {
		throw err;
	}

	http.createServer(app).listen(3000);
});

