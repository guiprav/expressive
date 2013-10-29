var glob = require('glob');
var templates = require('./templates');

function boilerplate_wrapper (handler) {
	return function (req, res) {
		handler.call(this, req, res, {
			req: req,
			res: res,
			push_message: boilerplate_functions.push_message,
			send_page: boilerplate_functions.send_page
		});
	};
}

var boilerplate_functions = {
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
		glob(__dirname + '/request-handlers/*.js', function (err, files) {
			if (err) {
				throw err;
			}

			files.forEach(function (file) {
				require(file)(app, boilerplate_wrapper);
			});
		});
	}
};

