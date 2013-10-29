var post = require('../post');

module.exports = function (app, bp) {
	app.get('/compose', function (req, res) {
		if (!req.session.user) {
			req.session.messages.push({ type: 'warning', text: 'You must be authenticated in order to post.' });
			res.redirect('/');

			return;
		}

		res.send(bp.render_page(req, 'compose'));
	});

	app.post('/compose', function (req, res) {
		if (!req.session.user) {
			req.session.messages.push({ type: 'warning', text: 'You must be authenticated in order to post.' });
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
					req.session.messages.push({ type: 'warning', text: 'Internal server error.' });

					res.send(500, bp.render_page(req, 'compose', {
						title: req.body.title,
						body: req.body.body,
						tags: req.body.tags
					}));
				}
				else {
					req.session.messages.push({ type: 'warning', text: err.message });

					res.send(bp.render_page(req, 'compose', {
						title: req.body.title,
						body: req.body.body,
						tags: req.body.tags
					}));
				}

				return;
			}

			req.session.messages.push({ type: 'success', text: 'Post published successfuly!' });

			res.redirect('/');
		});
	});
};
