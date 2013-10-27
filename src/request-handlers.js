var glob = require('glob');

module.exports = {
	register: function (app) {
		glob(__dirname + '/request-handlers/*.js', function (err, files) {
			if (err) {
				throw err;
			}

			files.forEach(function (file) {
				require(file)(app);
			});
		});
	}
};

