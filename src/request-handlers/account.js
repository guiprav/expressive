var auth = require('../auth');

module.exports = function (app, bp_wrapper) {
	app.post('/login', bp_wrapper(function (req, res, bp) {
		auth(req.body.email, req.body.password, function (err, user_data) {
			if (err) {
				bp.push_message('warning', 'Invalid email or password. Please try again.');
				res.redirect('/');

				return;
			}

			req.session.user = user_data;

			res.redirect('/');
		});
	}));

	app.get('/logout', bp_wrapper(function (req, res, bp) {
		req.session.user = null;

		bp.push_message('info', 'You have been logged out.');
		res.redirect('/');
	}));

	app.get('/create-account', bp_wrapper(function (req, res, bp) {
		bp.send_page('create_account');
	}));

	app.post('/create-account', bp_wrapper(function (req, res, bp) {
		if (req.body.password !== req.body['repeated-password']) {
			bp.push_message('warning', "The passwords you've entered don't match. Try again.");

			bp.send_page('create_account', {
				name: req.body.name,
				email: req.body.email
			});

			return;
		}

		auth.create(req.body.email, req.body.password, req.body.name, function (err) {
			if (err) {
				if (!err.user_presentable) {
					res.status(500);
					bp.push_message('warning', 'Internal server error.');

					bp.send_page('create_account', {
						name: req.body.name,
						email: req.body.email
					});
				}
				else {
					bp.push_message('warning', err.message);

					bp.send_page('create_account', {
						name: req.body.name,
						email: req.body.email
					});
				}

				return;
			}

			bp.push_message('success', 'Account created successfuly!');

			res.redirect('/');
		});
	}));
};

