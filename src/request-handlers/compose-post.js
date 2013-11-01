var post = require('../post');

module.exports = function (app) {
	app.get('/post/compose', function (req, res) {
		if (!req.session.user) {
			res.push_message('danger', 'You must be authenticated in order to post.');
			res.redirect('/');

			return;
		}

		res.send_page('compose');
	});

	app.post('/post/compose', function (req, res) {
		var template_data = {
			title: req.body.title,
			body: req.body.body,
			tags: req.body.tags
		};

		if (!req.session.user) {
			res.push_message('danger', 'You must be authenticated in order to post.');
			res.redirect('/');

			return;
		}

		req.body.tags = req.body.tags.split(',').map(function (tag) {
			return tag.trim();
		}).filter(function (tag) {
			return tag !== '';
		});

		post(req.body.title, req.body.body, req.body.tags, req.session.user, function (err) {
			if (err) {
				res.push_error_object(err);
				res.send_page('compose', template_data);

				return;
			}

			res.push_message('success', 'Post published successfuly!');
			res.redirect('/');
		});
	});

	app.get('/post/edit/:post_id', function (req, res) {
		if (!req.session.user) {
			res.push_message('danger', 'You must be authenticated in order to edit this post.');
			res.redirect('/');

			return;
		}

		post.getById(req.params.post_id, function (err, post) {
			if (err) {
				res.push_error_object(err);
				res.send_page('compose', { editing: true });

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

	app.post('/post/edit/:post_id',  function (req, res) {
		var template_data = {
			editing: true,
			title: req.body.title,
			body: req.body.body,
			tags: req.body.tags
		};

		if (!req.session.user) {
			res.push_message('danger', 'You must be authenticated in order to edit this post.');
			res.redirect('/');

			return;
		}

		if (req.body.delete) {
			post.delete(req.params.post_id, function (err) {
				if (err) {
					res.push_error_object(err);
					res.redirect('/');

					return;
				}

				res.push_message('success', 'Post deleted successfuly!');
				res.redirect('/');
			});

			return;
		}

		req.body.tags = req.body.tags.split(',').map(function (tag) {
			return tag.trim();
		}).filter(function (tag) {
			return tag !== '';
		});

		post.edit(req.params.post_id, req.body.title, req.body.body, req.body.tags, req.session.user, function (err) {
			if (err) {
				res.push_error_object(err);
				res.send_page('compose', template_data);

				return;
			}

			res.push_message('success', 'Post edited successfuly!');
			res.redirect('/');
		});
	});
};
