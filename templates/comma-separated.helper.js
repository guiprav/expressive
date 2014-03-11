module.exports = function(hbs, array, options) {
	return array
			.map(options.fn)
			.map (
				function(html) {
					return html.trim();
				}
			)
			.join(', ');
};
