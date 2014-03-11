var marked = require('marked');
module.exports = function(hbs, text) {
	return new hbs.SafeString (
		marked (
			text, {
				gfm: true
				, sanitize: true
				, breaks: true
				, tables: true
			}
		)
	);
};
