var moment = require('moment');
var post = require('../post');

module.exports = function (app, bp) {
	app.get('/', function (req, res) {
		post.get(function (err, posts) {
			if (err) {
				req.session.messages.push({ type: 'warning', text: 'Internal server error.' });
				res.send(500, bp.render_page(req, 'posts'));

				return;
			}

			res.send(bp.render_page(req, 'posts', {
				posts: posts
			}));
		});
	});
};

