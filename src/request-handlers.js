var glob = require('glob');
var templates = require('./templates');

var boilerplate = {
	push_message: function (type, text) {
		this.req.session.messages.push({ type: type, text: text });
	},

	send_page: function (body_template_name, body_template_parameters) {
		if (!body_template_parameters) {
			body_template_parameters = {};
		}

		var page = templates.page({
			user: this.req.session.user,
			messages: this.req.session.messages,
			body: templates[body_template_name](body_template_parameters)
		});

		this.req.session.messages = [];

		this.res.send(page);
	}
};

module.exports = {
	register: function (app) {
		app.use(function (req, res, next) {
			var api = { req: req, res: res };

			res.push_message = boilerplate.push_message.bind(api);
			res.send_page = boilerplate.send_page.bind(api);

			next();
		});

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

