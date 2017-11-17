var data = require('../data/data.json')

// Get a location by its name
exports.getAddress = function(premises, postcode) {

	var address = []

	// Filter firstline
	firstLine = data.firstLine.filter(
		x => x.premises.toLowerCase().includes(premises.toLowerCase())
		&& x.postcodeId == (data.postcode.find( y => y.path === postcode).id)
	)
	
	// If firstLine(s) found build address list
	firstLine.forEach(function (item) {
		address.push({ 'firstLine' : item.premises + ' ' + item.street })
	})

	return address

}