var auth = require('../auth');

module.exports = function (app) {
	app.post('/login', function (req, res) {
		auth(req.body.email, req.body.password, function (err, user_data) {
			if (err) {
				res.push_error_object(err);
				res.redirect('/');

				return;
			}

			req.session.user = user_data;

			res.redirect('/');
		});
	});

	app.get('/logout', function (req, res) {
		req.session.user = null;

		res.push_message('info', 'You have been logged out.');
		res.redirect('/');
	});

	app.get('/create-account', function (req, res) {
		res.send_page('create_account');
	});

	app.post('/create-account', function (req, res) {
		var template_data = {
			name: req.body.name,
			email: req.body.email
		};

		if (req.body.password !== req.body['repeated-password']) {
			res.push_message('warning', "The passwords you've entered don't match. Try again.");
			res.send_page('create_account', template_data);

			return;
		}

		auth.create(req.body.email, req.body.password, req.body.name, function (err) {
			if (err) {
				res.push_error_object(err);
				res.send_page('create_account', template_data);

				return;
			}

			res.push_message('success', 'Account created successfuly!');
			res.redirect('/');
		});
	});
};

