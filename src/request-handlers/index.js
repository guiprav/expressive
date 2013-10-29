var moment = require('moment');
var post = require('../post');

module.exports = function (app, bp_wrapper) {
	app.get('/', bp_wrapper(function (req, res, bp) {
		post.get(function (err, posts) {
			if (err) {
				res.status(500);
				bp.push_message('warning', 'Internal server error.');
				bp.send_page('posts');

				return;
			}

			bp.send_page('posts', { posts: posts });
		});
	}));
};

