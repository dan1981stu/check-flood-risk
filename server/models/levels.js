var data = require('../data/data.json')

// Get a location by its name
exports.getLevels = function(targetAreas) {

	levels = []

	for (var key in data.level) {
		var level = data.level[key]
		for (var key in targetAreas) {
			var targetArea = targetAreas[key]
			if (targetArea.levels.indexOf(level.id) > -1 && levels.indexOf(level) == -1) {
				// Add level
				levels.push(level)
			}
		}
	}

	return {
		levels
	}

}
