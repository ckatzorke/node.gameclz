var clz = require('./lib/gamecollection');
var util = require('util');

clz.parser.parseFile('./data/data.xml', function(err, result) {
	if (err) {
		if (callback) {
			callback(err);
		} else {
			throw err;
		}
	}
	util.log("total number of games: " + result.games.length);
	util.log("total number of platforms: " + result.platforms.length);
	result.platforms.forEach(function(p) {
		util.log(" " + p.name + " (" + p.games.length + ")");
	});
});