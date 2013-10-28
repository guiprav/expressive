var fs = require('fs');
var path = require('path');
var glob = require('glob');
var hbs = require('handlebars');
var marked = require('marked');
var moment = require('moment');

hbs.registerHelper('markdown', function (text) {
	return new hbs.SafeString(marked(text, { sanitize: true }));
});

hbs.registerHelper('verbose-date', function (timestamp) {
	return moment.unix(timestamp).format("dddd, MMMM Do YYYY, h:mm:ss a");
});

glob(__dirname + '/../templates/*.hbs', function (err, files) {
	if (err) {
		throw err;
	}

	files.forEach(function (file) {
		var template_name = path.basename(file, '.hbs');
		var template_src = fs.readFileSync(file, 'utf8');

		module.exports[template_name] = hbs.compile(template_src);
	});
});

