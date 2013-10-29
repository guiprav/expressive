var glob = require('glob');
var templates = require('./templates');

var boilerplate = {
	render_page: function (req, body_template_name, body_template_parameters) {
		if (!body_template_parameters) {
			body_template_parameters = {};
		}

		var page = templates.page({
			user: req.session.user,
			messages: req.session.messages,
			body: templates[body_template_name](body_template_parameters)
		});

		req.session.messages = [];

		return page;
	}
};

module.exports = {
	register: function (app) {
		glob(__dirname + '/request-handlers/*.js', function (err, files) {
			if (err) {
				throw err;
			}

			files.forEach(function (file) {
				require(file)(app, boilerplate);
			});
		});
	}
};

