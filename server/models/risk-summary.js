var data = require('../data/data.json')

// Get a location by its name
exports.getSummary = function(name, scenario) {

	var town, postcode, postcodes, warnings = []

	// Find in towns
	town = data.town.find(
		x =>x.name.toLowerCase() === name.toLowerCase().split('-').join(' ')
	)

	// Find all postcodes for location
	if (town) {
		postcodes = data.postcode.filter(x => x.townId === town.id)
	}

	// Find in postcodes
	if (!town) {
		postcode = data.postcode.find(
			x => x.name.toLowerCase() === name.toLowerCase().split('-').join(' ')
		)
		postcodes = [postcode]
		town = data.town.find(
			x => x.id === postcode.townId
		)
	}

	// Add relevant warnings for postcode and scenario
	if (postcodes) {
		
		var warningsByScenario = data.warning.filter(x =>x.scenario.indexOf(scenario) > -1)
		for (var key in warningsByScenario) {
			var warning = warningsByScenario[key]
			for (var key in postcodes) {
				if (postcodes[key].warnings.indexOf(warning.id) > -1) {
					if (warnings.indexOf(postcodes[key]) === -1) {
						warnings.push(warning)
					}
				}
			}
		}

	}

	// Build model and return
	return {
		'town' : town,
		'postcode' : postcode,
		warnings
	}

}
