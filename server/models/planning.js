var data = require('../data/data.json')

// Get a location by its name
exports.getLocation = function(place) {

	var location = {}, postcode, town, county

	// Find in postcodes
	location = data.postcode.find( x => x.name.toLowerCase() == place.toLowerCase())

	// Find in towns
	if(!(JSON.stringify(location).length)) {
		location = data.town.find( x => x.name.toLowerCase().includes(place.toLowerCase()))
	}

	// Find in counties
	if(!(JSON.stringify(location).length)) {
		location = data.county.find( x => x.name.toLowerCase().includes(place.toLowerCase()))
	}

	return location

}