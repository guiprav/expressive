var post = require('../post');

module.exports = function (app) {
	app.get('/compose', function (req, res) {
		if (!req.session.user) {
			res.push_message('warning', 'You must be authenticated in order to post.');
			res.redirect('/');

			return;
		}

		res.send_page('compose');
	});

	app.post('/compose', function (req, res) {
		if (!req.session.user) {
			res.push_message('warning', 'You must be authenticated in order to post.');
			res.redirect('/');

			return;
		}

		var tags = req.body.tags.replace(/, +/g, ',');
		tags = tags.split(',');

		if (tags.length === 1 && tags[0] === '') {
			tags = [];
		}

		post(req.body.title, req.body.body, tags, req.session.user, function (err) {
			if (err) {
				if (!err.user_presentable) {
					res.status(500);
					res.push_message('warning', 'Internal server error.');

					res.send_page('compose', {
						title: req.body.title,
						body: req.body.body,
						tags: req.body.tags
					});
				}
				else {
					res.push_message('warning', err.message);

					res.send_page('compose', {
						title: req.body.title,
						body: req.body.body,
						tags: req.body.tags
					});
				}

				return;
			}

			res.push_message('success', 'Post published successfuly!');

			res.redirect('/');
		});
	});

	app.get('/edit/:post_id', function (req, res) {
		if (!req.session.user) {
			res.push_message('warning', 'You must be authenticated in order to edit this post.');
			res.redirect('/');

			return;
		}

		post.getById(req.params.post_id, function (err, post) {
			if (err) {
				if (!err.user_presentable) {
					res.status(500);
					res.push_message('warning', 'Internal server error.');
					res.send_page('compose', { editing: true });
				}
				else {
					res.push_message('warning', err.message);
					res.send_page('compose', { editing: true });
				}

				return;
			}

			res.send_page('compose', {
				editing: true,
				title: post.title,
				body: post.body,
				tags: post.tags.join(', ')
			});
		});
	});

	app.post('/edit/:post_id',  function (req, res) {
		if (!req.session.user) {
			res.push_message('warning', 'You must be authenticated in order to edit this post.');
			res.redirect('/');

			return;
		}

		if (req.body.delete) {
			post.delete(req.params.post_id, function (err) {
				if (err) {
					if (!err.user_presentable) {
						res.push_message('warning', 'Internal server error.');
						res.redirect('/');
					}
					else {
						res.push_message('warning', err.message);
						res.redirect('/');
					}

					return;
				}

				res.push_message('success', 'Post deleted successfuly!');

				res.redirect('/');
			});

			return;
		}

		var tags = req.body.tags.replace(/, +/g, ',');
		tags = tags.split(',');

		if (tags.length === 1 && tags[0] === '') {
			tags = [];
		}

		post.edit(req.params.post_id, req.body.title, req.body.body, tags, req.session.user, function (err) {
			if (err) {
				if (!err.user_presentable) {
					res.status(500);
					res.push_message('warning', 'Internal server error.');

					res.send_page('compose', {
						editing: true,
						title: req.body.title,
						body: req.body.body,
						tags: req.body.tags
					});
				}
				else {
					res.push_message('warning', err.message);

					res.send_page('compose', {
						editing: true,
						title: req.body.title,
						body: req.body.body,
						tags: req.body.tags
					});
				}

				return;
			}

			res.push_message('success', 'Post edited successfuly!');

			res.redirect('/');
		});
	});
};
