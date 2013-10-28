var auth = require('../auth');
var templates = require('../templates');

module.exports = function (app) {
	app.post('/login', function (req, res) {
		auth(req.body.email, req.body.password, function (err, user_data) {
			if (err) {
				res.send(templates.page({
					user: req.session.user,
					body: templates.invalid_credentials()
				}));

				return;
			}

			req.session = { user: user_data };

			res.redirect('/');
		});
	});

	app.get('/logout', function (req, res) {
		req.session = null;
		res.redirect('/');
	});

	app.get('/create-account', function (req, res) {
		res.send(templates.page({
			user: req.session.user,
			body: templates.create_account({})
		}));
	});

	app.post('/create-account', function (req, res) {
		if (req.body.password !== req.body['repeated-password']) {
			res.send(templates.page({
				user: req.session.user,

				body: templates.create_account({
					error: "The passwords you've entered don't match. Try again.",
					name: req.body.name,
					email: req.body.email
				})
			}));

			return;
		}

		auth.create(req.body.email, req.body.password, req.body.name, function (err) {
			if (err) {
				if (!err.user_presentable) {
					res.send(500, templates.page({
						user: req.session.user,

						body: templates.create_account({
							error: 'Internal server error.',
							name: req.body.name,
							email: req.body.email
						})
					}));
				}
				else {
					res.send(templates.page({
						user: req.session.user,

						body: templates.create_account({
							error: err.message,
							name: req.body.name,
							email: req.body.email
						})
					}));
				}

				return;
			}

			res.send(templates.page({
				user: req.session.user,

				body: templates.create_account({
					success: true
				})
			}));
		});
	});
};

