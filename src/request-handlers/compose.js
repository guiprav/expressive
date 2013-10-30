var post = require('../post');

module.exports = function (app, bp_wrapper) {
	app.get('/compose', bp_wrapper(function (req, res, bp) {
		if (!req.session.user) {
			bp.push_message('warning', 'You must be authenticated in order to post.');
			res.redirect('/');

			return;
		}

		bp.send_page('compose');
	}));

	app.post('/compose', bp_wrapper(function (req, res, bp) {
		if (!req.session.user) {
			bp.push_message('warning', 'You must be authenticated in order to post.');
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
					bp.push_message('warning', 'Internal server error.');

					bp.send_page('compose', {
						title: req.body.title,
						body: req.body.body,
						tags: req.body.tags
					});
				}
				else {
					bp.push_message('warning', err.message);

					bp.send_page('compose', {
						title: req.body.title,
						body: req.body.body,
						tags: req.body.tags
					});
				}

				return;
			}

			bp.push_message('success', 'Post published successfuly!');

			res.redirect('/');
		});
	}));

	app.get('/edit/:post_id', bp_wrapper(function (req, res, bp) {
		if (!req.session.user) {
			bp.push_message('warning', 'You must be authenticated in order to edit this post.');
			res.redirect('/');

			return;
		}

		post.getById(req.params.post_id, function (err, post) {
			if (err) {
				if (!err.user_presentable) {
					res.status(500);
					bp.push_message('warning', 'Internal server error.');
					bp.send_page('compose', { editing: true });
				}
				else {
					bp.push_message('warning', err.message);
					bp.send_page('compose', { editing: true });
				}

				return;
			}

			bp.send_page('compose', {
				editing: true,
				title: post.title,
				body: post.body,
				tags: post.tags.join(', ')
			});
		});
	}));

	app.post('/edit/:post_id',  bp_wrapper(function (req, res, bp) {
		if (!req.session.user) {
			bp.push_message('warning', 'You must be authenticated in order to edit this post.');
			res.redirect('/');

			return;
		}

		if (req.body.delete) {
			post.delete(req.params.post_id, function (err) {
				if (err) {
					if (!err.user_presentable) {
						bp.push_message('warning', 'Internal server error.');
						res.redirect('/');
					}
					else {
						bp.push_message('warning', err.message);
						res.redirect('/');
					}

					return;
				}

				bp.push_message('success', 'Post deleted successfuly!');

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
					bp.push_message('warning', 'Internal server error.');

					bp.send_page('compose', {
						editing: true,
						title: req.body.title,
						body: req.body.body,
						tags: req.body.tags
					});
				}
				else {
					bp.push_message('warning', err.message);

					bp.send_page('compose', {
						editing: true,
						title: req.body.title,
						body: req.body.body,
						tags: req.body.tags
					});
				}

				return;
			}

			bp.push_message('success', 'Post edited successfuly!');

			res.redirect('/');
		});
	}));
};
