var moment = require('moment');
var post = require('../post');

module.exports = function (app) {
	app.get('/', function (req, res) {
		post.get(function (err, posts) {
			if (err) {
				res.status(500);
				res.push_message('warning', 'Internal server error.');
				res.send_page('posts');

				return;
			}

			res.send_page('posts', { posts: posts });
		});
	});
};

