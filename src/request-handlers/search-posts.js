var post = require('../post');

module.exports = function (app) {
	app.get('/post/search', function (req, res) {
		res.send_page('search');
	});

	app.post('/post/search', function (req, res) {
		var template_data = {
			title: req.body.title,
			tags: req.body.tags
		};

		var title = req.body.title.trim();

		var tags = req.body.tags.replace(/, +/g, ',');
		tags = tags.split(',');

		if (tags.length === 1 && tags[0] === '') {
			tags = [];
		}

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
