var mongo_lib = require('mongodb');
var mongo_client = mongo_lib.MongoClient;

if (process.env.NODE_ENV === 'production') {
	var mongo_uri = process.env.MONGO_URI;
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

