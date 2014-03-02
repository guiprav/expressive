var fs = require('fs');
var path = require('path');
var glob = require('glob');
var hbs = require('handlebars');
var marked = require('marked');
var moment = require('moment');
var remove_diacritics = require('diacritics').remove;

hbs.registerHelper('markdown', function (text) {
	return new hbs.SafeString(marked(text, {
		gfm: true,
		sanitize: true,
		breaks: true,
		tables: true
	}));
});

hbs.registerHelper('comma-separated', function (array, options) {
	return array.map(options.fn).join(', ');
});

hbs.registerHelper('verbose-date', function (timestamp) {
	return moment.unix(timestamp).format("dddd, MMMM Do YYYY, h:mm:ss a");
});

hbs.registerHelper('make-slug', function (text) {
	return remove_diacritics(text)
			.replace(/'/g, '')
			.toLowerCase()
			.replace(/[^a-z0-9+]/g, '-')
			.replace(/^-+/, '')
			.replace(/-+$/, '');
});

glob(__dirname + '/../templates/*.hbs', function (err, files) {
	if (err) {
		throw err;
	}

	files.forEach(function (file) {
		var template_src = fs.readFileSync(file, 'utf8');
		var template_name = path.basename(file, '.hbs');
		if (path.extname(template_name) === '.partial')
		{
			var partial_name = path.basename(template_name, '.partial');
			hbs.registerPartial(partial_name, template_src);
		}
		else
		{
			module.exports[template_name] = hbs.compile(template_src);
		}
	});
});

