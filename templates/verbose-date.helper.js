var moment = require('moment');
module.exports = function(hbs, timestamp) {
	return moment.unix(timestamp).format("dddd, MMMM Do YYYY, h:mm:ss a");
};
