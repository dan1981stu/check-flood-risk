var data = require('../data/data.json')

// Get a location by its name
exports.getProperty = function(premises, postcode) {

	var property = [], postcodes = [], country

	// Find postcode
	p = data.postcode.find( y => y.path == postcode)
	pId = p != null ? p.id : -1

	// Filter firstline
	firstLine = data.firstLine.filter(function(x){
		// If premises containes a name, flat or apartment
		if (isNaN(x.premises)) {
			var premisesStreet = x.premises.concat(', ' + x.street).toLowerCase()
			return premisesStreet.includes(premises.toLowerCase()) ? true : false
		} 
		// If premises is a number
		else {
			return x.premises.toLowerCase() == premises.toLowerCase() ? true : false
		}
	})
	
	// If firstLine(s) found build address list
	firstLine.forEach(function (item) {
		// Add comma to non number premises
		premises = isNaN(item.premises) ? item.premises + ', ' : item.premises
		// Get postcode for address
		postcode = data.postcode.find( x => x.id == item.postcodeId)
		// Get town for postcode
		town = data.town.find( x => x.id == postcode.townId)
		// Concatenate the address
		address = premises + ' ' + item.street + ', ' + town.name + ', ' + postcode.name
		// Create the path
		path = address.replace(/,\s+/g,'/').replace(/\s+/g, '-').toLowerCase()
		// Add item to list
		property.push({ 'address' : address, 'path' : path, 'postcode' : postcode.name, 'country' : postcode.country })
	})

	return property

}