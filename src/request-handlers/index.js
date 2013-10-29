var moment = require('moment');
var post = require('../post');

module.exports = function (app, bp_wrapper) {
	app.get('/', bp_wrapper(function (req, res, bp) {
		post.get(function (err, posts) {
			if (err) {
				req.session.messages.push({ type: 'warning', text: 'Internal server error.' });

				res.status(500);
				bp.send_page('posts');

				return;
			}

			bp.send_page('posts', { posts: posts });
		});
	}));
};

