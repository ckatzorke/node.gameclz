var xml2js = require('xml2js');
var fs = require('fs');
var util = require('util');
var gamecollection = {};
var clzxmlparser = (function() {
	return {
		"parseFile": function(fileName, callback) {
			fs.readFile(fileName, function(err, data) {
				if (err) {
					if (callback !== undefined) {
						callback(err);
					} else {
						throw err;
					}
				}
				clzxmlparser.parseString(data, callback);
			});
		},
		"parseString": function(xmlString, callback) {
			var parser = new xml2js.Parser();
			parser.parseString(xmlString, function(err, result) {
				util.log('Parsing done...');
				if (err) {
					if (callback) {
						callback(err);
					} else {
						throw err;
					}
				}
				clzxmlparser.saveJson(result);
				//now do some crunching
				clzxmlparser.crunch(result, callback);
			});
		},
		"saveJson": function(json) {
			fs.writeFile('./data/collection.json', JSON.stringify(json), function(err) {
				if (err) {
					util.log("JSON could not be safed.");
				}
				util.log('JSON saved!');
			});
		},
		"crunch": function(json, callback) {
			gamecollection.numberOfGames = json.gameinfo.gamelist[0].game.length;
			var platforms = [];
			var games = [];
			json.gameinfo.gamelist[0].game.forEach(function(game) {
				var platformName = game.platform[0].displayname;
				var p = platforms[platformName];
				if (p === null || p === undefined) {
					p = {
						name: platformName,
						games: []
					};
					platforms[platformName] = p;
					platforms.push(p);
				}
				var g = {
					name: game.title,
					platform: p.name
				};
				p.games.push(g);
				games.push(g);
			});
			//sort by # of games desc
			platforms.sort(function(a, b) {
				if (a.games.length > b.games.length) return -1;
				if (a.games.length < b.games.length) return 1;
				return 0;
			});
			gamecollection.platforms = platforms;
			gamecollection.games = games;
			if (callback !== undefined) callback(null, gamecollection);
		}
	};
})();

exports.parser = clzxmlparser;
exports.gamecollection = gamecollection;