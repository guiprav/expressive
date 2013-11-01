var moment = require('moment');
var post = require('../post');

module.exports = function (app) {
	app.get('/', function (req, res) {
		var template_data = {
			logged_in: !!req.session.user
		};

		post.get(function (err, posts) {
			if (err) {
				res.push_error_object(err);
				res.send_page('posts', template_data);

				return;
			}

			template_data.posts = posts;

			res.send_page('posts', template_data);
		});
	});
};

