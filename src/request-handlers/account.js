var auth = require('../auth');

module.exports = function (app, bp_wrapper) {
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

	app.get('/create-account', bp_wrapper(function (req, res, bp) {
		bp.send_page('create_account');
	}));

	app.post('/create-account', bp_wrapper(function (req, res, bp) {
		if (req.body.password !== req.body['repeated-password']) {
			req.session.messages.push({ type: 'warning', text: "The passwords you've entered don't match. Try again." });

			bp.send_page('create_account', {
				name: req.body.name,
				email: req.body.email
			});

			return;
		}

		auth.create(req.body.email, req.body.password, req.body.name, function (err) {
			if (err) {
				if (!err.user_presentable) {
					req.session.messages.push({ type: 'warning', text: 'Internal server error.' });

					res.status(500);
					bp.send_page('create_account', {
						name: req.body.name,
						email: req.body.email
					});
				}
				else {
					req.session.messages.push({ type: 'warning', text: err.message });

					bp.send_page('create_account', {
						name: req.body.name,
						email: req.body.email
					});
				}

				return;
			}

			req.session.messages.push({ type: 'success', text: 'Account created successfuly!' });

			res.redirect('/');
		});
	}));
};

