var mongo = require('mongodb').MongoClient;

module.exports = {
	handle: null,

	connect: function (cb) {
		mongo.connect('mongodb://localhost/emblog', function (err, db) {
			if (err) {
				cb(err);
				return;
			}

			module.exports.handle = db;

			cb(null);
		});
	}
};

