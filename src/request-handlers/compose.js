var post = require('../post');
var templates = require('../templates');

module.exports = function (app) {
	app.get('/compose', function (req, res) {
		res.send(templates.page({
			user: req.session.user,
			body: templates.compose({
				authenticated: !!req.session.user
			})
		}));
	});

	app.post('/compose', function (req, res) {
		var tags = req.body.tags.replace(/, +/g, ',');
		tags = tags.split(',');

		if (tags.length === 1 && tags[0] === '') {
			tags = [];
		}

		post(req.body.title, req.body.body, tags, req.session.user, function (err) {
			if (err) {
				if (!err.user_presentable) {
					res.send(500, templates.page({
						user: req.session.user,

						body: templates.compose({
							error: 'Internal server error.',
							authenticated: !!req.session.user,
							title: req.body.title,
							body: req.body.body,
							tags: req.body.tags
						})
					}));
				}
				else {
					res.send(templates.page({
						user: req.session.user,

						body: templates.compose({
							error: err.message,
							authenticated: !!req.session.user,
							title: req.body.title,
							body: req.body.body,
							tags: req.body.tags
						})
					}));
				}

				return;
			}

			res.send(templates.page({
				user: req.session.user,

				body: templates.compose({
					success: 'Post published successfuly!',
					authenticated: !!req.session.user
				})
			}));
		});
	});
};
