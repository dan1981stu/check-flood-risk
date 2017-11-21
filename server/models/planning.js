var data = require('../data/data.json')

// Get a location by its name
exports.getCountry = function(place) {

	var location, postcode, town, county, country

	// Find in postcodes
	location = data.postcode.find( x => x.name.toLowerCase() == place.toLowerCase())

	// Find in towns
	if(location == null) {
		location = data.town.find( x => x.name.toLowerCase().includes(place.toLowerCase()))
	}

	// Find in counties
	if(location == null) {
		location = data.county.find( x => x.name.toLowerCase().includes(place.toLowerCase()))
	}

	// Set country code
	if(location != null) {
		switch(location.country) {
			case 's':
				country = { 'code' : 's', 'name' : 'Scotland' }
				break
			case 'w':
				country = { 'code' : 'w', 'name' : 'Wales' }
				break
			case 'w':
				country = { 'code' : 'ni', 'name' : 'Northern Ireland' }
				break
			default:
				country = { 'code' : 'e', 'name' : 'England' }
		}
	}

	// Return country object
	return country

}