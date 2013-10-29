var auth = require('../auth');

module.exports = function (app, bp) {
	app.post('/login', function (req, res) {
		auth(req.body.email, req.body.password, function (err, user_data) {
			if (err) {
				req.session.messages.push({ type: 'warning', text: 'Invalid email or password. Please try again.' });
				res.redirect('/');

				return;
			}

			req.session.user = user_data;

			res.redirect('/');
		});
	});

	app.get('/logout', function (req, res) {
		req.session.user = null;
		req.session.messages.push({ type: 'info', text: 'You have been logged out.' });
		res.redirect('/');
	});

	app.get('/create-account', function (req, res) {
		res.send(bp.render_page(req, 'create_account'));
	});

	app.post('/create-account', function (req, res) {
		if (req.body.password !== req.body['repeated-password']) {
			req.session.messages.push({ type: 'warning', text: "The passwords you've entered don't match. Try again." });

			res.send(bp.render_page(req, 'create_account', {
				name: req.body.name,
				email: req.body.email
			}));

			return;
		}

		auth.create(req.body.email, req.body.password, req.body.name, function (err) {
			if (err) {
				if (!err.user_presentable) {
					req.session.messages.push({ type: 'warning', text: 'Internal server error.' });

					res.send(500, bp.render_page(req, 'create_account', {
						name: req.body.name,
						email: req.body.email
					}));
				}
				else {
					req.session.messages.push({ type: 'warning', text: err.message });

					res.send(bp.render_page(req, 'create_account', {
						name: req.body.name,
						email: req.body.email
					}));
				}

				return;
			}

			req.session.messages.push({ type: 'success', text: 'Account created successfuly!' });

			res.redirect('/');
		});
	});
};

