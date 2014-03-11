module.exports = function(hbs, array, options) {
	return array.map(options.fn).join(', ');
};
