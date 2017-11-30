const utilities = require('../utilities/utilities.js')
var data = require('../data/data.json')

// Get a location by its name
exports.getLocation = function(type, place, ngr, easting, northing, scenario, error) {

	// Set method defaults
	type = type || 'place'
	place = place || '',
	ngr = ngr || '',
	easting = easting || '',
	northing = northing || ''
	scenario = scenario || 'a'
	error = error || false
	
	var model = {}, location

	// Postcode, town, county search
	if (type == 'place') {

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

	}

	// National grid reference search or Easting and northing search
	else {

		location = {}

	}

	// Set has location boolean
	if (typeof location === 'object') {
		model['hasLocation'] = true
	} else {
		model['hasLocation'] = false
	}

	// Set country properties if location exists
	if (typeof location === 'object') {

		var countryCode , countryName
		switch(location.country) {
			case 's':
				countryCode = 's'
				countryName = 'Scotland'
				break
			case 'w':
				countryCode = 'w'
				countryName = 'Wales'
				break
			case 'ni':
				countryCode = 'ni'
				countryName = 'Northern Ireland'
				break
			default:
				countryCode = 'e'
				countryName = 'England'
		}
		model['countryCode'] = countryCode
		model['countryName'] = countryName

		// Set is England boolean
		if (countryCode == 'e') {
			model['isEngland'] = true
		} else {
			model['isEngland'] = false
		}
	
	}

	// Add lat long for location.
	// Mytholmroyd hardcoded in prototype
	if (model.hasLocation) {
		model['lonLat'] = '-1.9837,53.7309'
	}

	// If patern match error add error details
	if (error) {
		var errors
		if(error && error.data) {
			errors = utilities.extractValidationErrors(error) // the error field + message
		}
		model['isError'] = true
		model['errors'] = errors
	}

	// If no location add error details
	else if (!model.hasLocation) {
		// Place search error
		if (type == 'place') {
			model['isError'] = true
			model['errors'] = { 
				'place' : { 
					'type' : 'any.notFound', 
					'message' : '' 
				} 
			}
		}
	}

	// Build and return model
	model['type'] = type
	model['place'] = place
	model['ngr'] = ngr
	model['easting'] = easting
	model['northing'] = northing
	model['scenario'] = scenario

	return model

}

// Get a location by its name
exports.getBoundary = function(hasBoundary, lonLat) {

	var model = { }

	model['isError'] = false
	model['hasBoundary'] = false
	model['lonLat'] = JSON.parse('[' + lonLat + ']')

	return model

}
	