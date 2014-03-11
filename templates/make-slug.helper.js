var remove_diacritics = require('diacritics').remove;
module.exports = function(hbs, text) {
	return remove_diacritics(text)
			.replace(/'/g, '')
			.toLowerCase()
			.replace(/[^a-z0-9+]/g, '-')
			.replace(/^-+/, '')
			.replace(/-+$/, '');
};
