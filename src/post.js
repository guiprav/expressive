var moment = require('moment');
var db = require('./database');

module.exports = function (title, body, tags, author, cb) {
	var posts = db.handle.collection('posts');

	posts.insert(
		{
			title: title,
			body: body,
			tags: tags,
			author: author,
			on: moment().unix()
		},

		{ safe: true },

		function (err) {
			if (err) {
				cb(err);
				return;
			}

			cb(null);
		}
	);
};

module.exports.edit = function (post_id, title, body, tags, editor, cb) {
	var posts = db.handle.collection('posts');

	posts.update(
		{ _id: new db.ObjectID(post_id) },

		{
			$set: {
				title: title,
				body: body,
				tags: tags,
				last_editor: editor,
				last_edited_on: moment().unix()
			}
		},

		{ safe: true },

		function (err) {
			if (err) {
				cb(err);
				return;
			}

			cb(null);
		}
	);
};

module.exports.delete = function (post_id, cb) {
	var posts = db.handle.collection('posts');

	posts.remove(
		{ _id: new db.ObjectID(post_id) },

		{ safe: true },

		function (err) {
			if (err) {
				cb(err);
				return;
			}

			cb(null);
		}
	);
};

module.exports.get = function (cb) {
	var posts = db.handle.collection('posts');

	posts.find(
		{
			$query: {},
			$orderby: { on: -1 }
		},

		function (err, posts) {
			if (err) {
				cb(err);
				return;
			}

			posts.toArray(cb);
		}
	);
};

module.exports.getById = function (post_id, cb) {
	var posts = db.handle.collection('posts');

	posts.findOne(
		{ _id: new db.ObjectID(post_id) },

		function (err, post) {
			if (err) {
				cb(err);
				return;
			}

			cb(null, post);
		}
	);
};

module.exports.search = function (title, tags, cb) {
	var posts = db.handle.collection('posts');

	var title_terms = title.split(/[ -]/).filter(
		function (term) {
			return term !== '';
		}
	).map(
		function (term) {
			return new RegExp(term, 'gi');
		}
	);

	var query = {};

	if (title_terms.length !== 0) {
		query.title = { $all: title_terms };
	}

	if (tags.length !== 0) {
		query.tags = { $all: tags };
	}

	posts.find(query, function (err, posts) {
		if (err) {
			cb(err);
			return;
		}

		posts.toArray(cb);
	});
};

