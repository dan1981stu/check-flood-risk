var data = require('../data/data.json')

// Get a location by its name
exports.getAddress = function(premises, postcode) {

	var address = [], postcodes = []

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
		address.push({ 'firstLine' : item.premises + ' ' + item.street })
	})

	return address

}