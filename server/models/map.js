var data = require('../data/data.json')

// Get full location from its path
exports.getLocationFromPath = function(path, scenario) {
	
    var
        location,
        town, 
		postcode,
        lonLat
	
    // Find in towns
	town = data.town.find(x => x.path === path)

    // If postcode find in postcodes
	if (!town) {
		postcode = data.postcode.find(x => x.path === path)
		town = data.town.find(x => x.id === postcode.townId)
	}

	// Set location and lonLat
	location = town.name;
    lonLat = town.lonLat
	if (postcode) {
		location = postcode.name + ', ' + town.name
		lonLat = postcode.lonLat
	}

    return {
        'location' : location,
        'town' : town.name,
        'postcode' : postcode.name,
        'lonLat' : lonLat,
        'path' : path,
        'scenario' : scenario
    }

}