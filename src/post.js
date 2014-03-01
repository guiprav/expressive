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

module.exports.comment = function (post_id, author, body, cb) {
	var posts = db.handle.collection('posts');

	posts.update(
		{ _id: new db.ObjectID(post_id) },

		{ $push: { comments: { author: author, body: body } } },

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

module.exports.get = function (include_unlisted, cb) {
	var posts = db.handle.collection('posts');
	var query = {};

	if (!include_unlisted)
	{
		query.tags = query.tags || {};
		query.tags.$ne = 'unlisted';
	}

	posts.aggregate(
		[
			{
				$match: query
			},
			{
				$unwind: '$tags'
			},
			{
				$project:
				{
					title: 1,
					author: 1,
					body: 1,
					last_edited_on: 1,
					last_editor: 1,
					on: 1,
					tags: 1,
					is_pinned: { $eq: ['$tags', 'pinned'] }
				}
			},
			{
				$group:
				{
					_id: '$_id',
					title: { $first: '$title' },
					author: { $first: '$author' },
					body: { $first: '$body' },
					last_edited_on: { $first: '$last_edited_on' },
					last_editor: { $first: '$last_editor' },
					on: { $first: '$on' },
					tags: { $push: '$tags' },
					is_pinned: { $max: '$is_pinned' }
				}
			},
			{
				$sort:
				{
					is_pinned: -1,
					on: -1
				}
			}
		],
		cb
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

module.exports.search = function (title, tags, include_unlisted, cb) {
	var posts = db.handle.collection('posts');

	function regexify (string) {
		return new RegExp(string, 'gi');
	}

	var title_terms = title.split(/[ -]/).filter(
		function (term) {
			return term !== '';
		}
	).map(regexify);

	tags = tags.map(regexify);

	var query = {};

	if (title_terms.length !== 0) {
		query.title = { $all: title_terms };
	}

	if (tags.length !== 0) {
		query.tags = { $all: tags };
	}

	if (!include_unlisted)
	{
		query.tags = query.tags || {};
		query.tags.$ne = 'unlisted';
	}

	posts.find(
		{
			$query: query,
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

