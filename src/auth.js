var crypto = require('crypto');
var db = require('./database');

function md5 (data) {
	return crypto.createHash('md5').update(data).digest('hex');
}

module.exports = function (email, password, cb) {
	var users = db.handle.collection('users');

	users.findOne(
		{
			email: email,

			$or: [
				{
					password: password,
					password_cipher: { $exists: false }
				},

				{
					password: md5(password),
					password_cipher: 'md5'
				}
			]
		},

		function (err, user) {
			if (err) {
				console.error('database error:', err);
				cb(err);

				return;
			}

			if (user) {
				cb(null, user);
			}
			else {
				var err = new Error('Authentication failure: invalid email or password.');
				err.user_presentable = true;

				cb(err);
			}
		}
	);
};

module.exports.create = function (email, password, name, cb) {
	if (name === '') {
		var err = new Error('Name must not be empty.');
		err.user_presentable = true;

		cb(err);

		return;
	}

	if (email === '') {
		var err = new Error('Email must not be empty.');
		err.user_presentable = true;

		cb(err);

		return;
	}

	if (password.length < 4) {
		var err = new Error('Password must have at least 4 characters.');
		err.user_presentable = true;

		cb(err);

		return;
	}

	var users = db.handle.collection('users');

	users.findOne(
		{ email: email },

		function (err, existing_user) {
			if (err) {
				cb(err);
				return;
			}

			if (existing_user) {
				var err = new Error('A user with this email address already exists in the database.');
				err.user_presentable = true;

				cb(err);

				return;
			}
			else {
				users.insert(
					{
						name: name,
						email: email,
						password: md5(password),
						password_cipher: 'md5'
					},

					function (err) {
						if (err) {
							cb(err);
							return;
						}

						cb(null);
					}
				);
			}
		}
	);
};

