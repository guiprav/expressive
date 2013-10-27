var moment = require('moment');
var post = require('../post');
var templates = require('../templates');

module.exports = function (app) {
	app.get('/', function (req, res) {
		post.get(function (err, posts) {
			if (err) {
				res.send(500, templates.page({
					user: req.session.user,
					body: templates.posts({
						error: 'Internal server error.',
						posts: []
					})
				}));

				return;
			}

			res.send(templates.page({
				user: req.session.user,

				body: templates.posts({
					posts: posts
				})
			}));
		});
	});
};

