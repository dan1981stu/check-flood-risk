var data = require('../data/data.json')

// Get a location by its name
exports.getLocationsFromValue = function(postcodeTown) {
	var towns = []
	// Find in towns
	towns = data.town.filter(
		x => x.name.toLowerCase().includes(postcodeTown.toLowerCase())
	)
	// If location exists build model and return
	if (towns) {	
		return towns
	}
	return ''
}