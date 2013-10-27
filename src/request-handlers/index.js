var moment = require('moment');
var templates = require('../templates');

module.exports = function (app) {
	app.get('/', function (req, res) {
		res.send(templates.page({
			user: req.session.user,

			body: templates.posts({
				posts: [
					{
						title: 'How to make the world better?',

						body: 'Lorem ipsum humanitarianism...',

						on: moment('10/26/2013').unix(),

						author: {
							name: 'Guilherme',
							email: 'super.driver.512@gmail.com'
						}
					}
				]
			})
		}));
	});
};

