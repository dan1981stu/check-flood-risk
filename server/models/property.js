var data = require('../data/data.json')

// Get a location by its name
exports.getProperty = function(premises, postcode) {

	var property = [], postcodes = [], country

	// Find postcode
	p = data.postcode.find( y => y.path == postcode)
	pId = p != null ? p.id : -1

	// Filter firstline
	firstLine = data.firstLine.filter(
		x => x.premises.toLowerCase().includes(premises.toLowerCase())
		&& x.postcodeId == pId
	)
	
	// If firstLine(s) found build address list
	firstLine.forEach(function (item) {
		// Add comma to non number premises
		premises = isNaN(item.premises) ? item.premises + ', ' : item.premises
		// Get postcode for address
		postcode = data.postcode.find( x => x.id == item.postcodeId)
		// Get town for postcode
		town = data.town.find( x => x.id == postcode.townId)
		// Add item to list
		property.push({ 'address' : premises + ' ' + item.street + ', ' + town.name + ', ' + postcode.name, 'postcode' : postcode.name, 'country' : postcode.country })
	})

	return property

}