var fs = require('fs');
var path = require('path');
var glob = require('glob');
var hbs = require('handlebars');

glob (
	__dirname + '/../templates/*.helper.js', function(err, files) {
		if(err) {
			throw err;
		}

		files.forEach (
			function(file) {
				var helper = require(file).bind(null, hbs);
				var name = path.basename(file, '.helper.js');
				hbs.registerHelper(name, helper);
			}
		);
	}
);

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
