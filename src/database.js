var mongo = require('mongodb').MongoClient;

if (process.env.NODE_ENV === 'production') {
	var mongo_uri = 'mongodb://emblog:ashfgaosgnoekgnwoegksakgm@ds053148.mongolab.com:53148/heroku_app18867064';
}
else {
	var mongo_uri = 'mongodb://localhost/emblog';
}

module.exports = {
	handle: null,

	connect: function (cb) {
		mongo.connect(mongo_uri, function (err, db) {
			if (err) {
				cb(err);
				return;
			}

			module.exports.handle = db;

			cb(null);
		});
	}
};

