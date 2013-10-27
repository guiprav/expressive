var db = require('./database');

module.exports = function (email, password, cb) {
	var users = db.handle.collection('users');

	users.findOne({ email: email, password: password }, function (err, user) {
		if (err) {
			console.error('database error:', err);
			cb(err);

			return;
		}

		if (user) {
			cb(null, user);
		}
		else {
			cb(new Error('Invalid credentials.'));
		}
	});
};

