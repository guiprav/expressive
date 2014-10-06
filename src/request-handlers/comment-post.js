var post = require('../post');

module.exports = function (app) {
	app.post('/post/comment', function (req, res) {
		if (req.session.user) {
			req.body.name = req.session.user.name;
		}

		if(process.env.DISABLE_COMMENTS) {
			res.push_message('error', 'Sorry, but comments are currently disabled, boo! :(');
			res.redirect('/');

			return;
		}

		post.comment(req.body.post_id, req.body.name, req.body.body, function (err) {
			if (err) {
				res.push_error_object(err);
				res.redirect('/');

				return;
			}

			res.push_message('success', 'Comment published. Thanks!');

			res.redirect('/');
		});
	});
};
