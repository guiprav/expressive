var mongo_lib = require('mongodb');
var mongo_client = mongo_lib.MongoClient;

if (process.env.NODE_ENV === 'production') {
	var mongo_uri = 'mongodb://expressive:ashfgaosgnoekgnwoegksakgm@ds053148.mongolab.com:53148/heroku_app18867064';
}
else {
	var mongo_uri = 'mongodb://localhost/expressive';
}

module.exports = {
	handle: null,

	ObjectID: mongo_lib.ObjectID,

	connect: function (cb) {
		mongo_client.connect(mongo_uri, function (err, db) {
			if (err) {
				cb(err);
				return;
			}

			module.exports.handle = db;

			cb(null);
		});
	}
};

