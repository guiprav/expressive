var post = require('../post');

module.exports = function (app) {
	app.get('/post/search', function (req, res) {
		res.send_page('search', { user: req.session.user });
	});

	app.get('/post/by-tag/:tag', function (req, res) {
		var template_data = {
			user: req.session.user,
			tags: req.params.tag
		};

		post.search('', [ req.params.tag ], function (err, posts) {
			if (err) {
				res.push_error_object(err);
				res.send_page('search', template_data);

				return;
			}

			if (posts.length === 0) {
				res.push_message('warning', 'No posts matching your criteria have been found. Try simplifying them.');
			}

			template_data.posts = posts;

			res.send_page('search', template_data);
		});
	});

	app.post('/post/search', function (req, res) {
		var template_data = {
			user: req.session.user,
			title: req.body.title,
			tags: req.body.tags
		};

		var title = req.body.title.trim();

		var tags = req.body.tags.split(',').map(function (tag) {
			return tag.trim();
		}).filter(function (tag) {
			return tag !== '';
		});

		post.search(title, tags, function (err, posts) {
			if (err) {
				res.push_error_object(err);
				res.send_page('search', template_data);

				return;
			}

			if (posts.length === 0) {
				res.push_message('warning', 'No posts matching your criteria have been found. Try simplifying them.');
			}

			template_data.posts = posts;

			res.send_page('search', template_data);
		});
	});
};
