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

		var include_unlisted = !!req.session.user;

		post.search('', [ req.params.tag ], include_unlisted, function (err, posts) {
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

		req.body.tags = req.body.tags.split(',').map(function (tag) {
			return tag.trim();
		}).filter(function (tag) {
			return tag !== '';
		});

		var include_unlisted = !!req.session.user;

		post.search(
			req.body.title,
			req.body.tags,
			include_unlisted,

			function (err, posts) {
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
			}
		);
	});

	app.get('/post/:id', post_by_id);
	app.get('/post/:id/:slug', post_by_id);

	function post_by_id (req, res) {
		var template_data = {
			user: req.session.user
		};

		post.getById(req.params.id, function (err, post) {
			if (err) {
				res.push_error_object(err);
				res.send_page('post', template_data);

				return;
			}

			if (!post) {
				res.status(404);
				res.push_message(
					'warning',
					'Sorry, but the post you are looking for ' +
					'could not be found. The URL may be wrong, ' +
					'or the post may have been deleted.'
				);

				return;
			}

			template_data.post = post;

			res.send_page('post', template_data);
		});
	}
};
