var fs = require('fs');
var hbs = require('handlebars');
var moment = require('moment');

hbs.registerHelper('verbose-date', function (timestamp) {
	return moment.unix(timestamp).format("dddd, MMMM Do YYYY, h:mm:ss a");
});

var template_names = [
	'page',
	'posts'
];

template_names.forEach(function (name) {
	var template_src = fs.readFileSync(__dirname + '/../templates/' + name + '.hbs', 'utf8');
	module.exports[name] = hbs.compile(template_src);
});

