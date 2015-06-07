var marked = require('marked');
module.exports = function(hbs, text, options) {
	text = text || '';
	if(options.hash.sanitize === undefined) {
		options.hash.sanitize = true;
	}
	return new hbs.SafeString (
		marked (
			text, {
				gfm: true
				, sanitize: options.hash.sanitize
				, breaks: true
				, tables: true
			}
		)
	);
};
