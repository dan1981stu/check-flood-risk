var data = require('../data/data.json')

// Get a location by its name
exports.getSummary = function(name, scenario) {

	var
		town, 
		postcode, 
		postcodes,  
		location,
		alertsByScenario = [],
		alerts = [],
		warningsByScenario = [],
		warnings = [],
		intersectingWarning = {},
		intersectingAlert = {},
		hasWarnings = false,
		hasIntersect = false

	// Find in towns
	town = data.town.find(
		x => x.name.toLowerCase() === name.toLowerCase().split('-').join(' ')
	)

	// If town find all postcodes for location
	if (town) {
		postcodes = data.postcode.filter(x => x.townId === town.id)
	}

	// If postcode find in postcodes
	if (!town) {
		postcode = data.postcode.find(
			x => x.name.toLowerCase() === name.toLowerCase().split('-').join(' ')
		)
		postcodes = [postcode]
		town = data.town.find(
			x => x.id === postcode.townId
		)
	}

	// Set location
	location = town.name;
	if (postcode) {
		location = postcode.name + ', ' + town.name
	}

	// Get all warnings and alerts for scenario
	warningsByScenario = data.targetArea.filter(x => x.scenario.indexOf(scenario) > -1 && x.severity === 2)
	alertsByScenario = data.targetArea.filter(x => x.scenario.indexOf(scenario) > -1 && x.severity === 3)

	// Add intersecting warning for postcode if in force
	if (postcode) {
		intersectingWarning = warningsByScenario.find(x => x.id == postcode.intersectingWarning)
		if (!intersectingWarning) {
			intersectingAlert = alertsByScenario.find(x => x.id == postcode.intersectingAlert)
		}
	}

	// Add nearby warnings for postcode
	if (postcodes) {
		for (var key in warningsByScenario) {
			var warning = warningsByScenario[key]
			for (var key in postcodes) {
				if (postcodes[key].targetAreas.indexOf(warning.id) > -1) {
					if (warnings.indexOf(warning) == -1 && warning != intersectingWarning) {
						warnings.push(warning)
					}
				}
			}
		}
	}

	// Add nearby alerts for postcode
	if (postcodes) {
		for (var key in alertsByScenario) {
			var alert = alertsByScenario[key]
			for (var key in postcodes) {
				if (postcodes[key].targetAreas.indexOf(alert.id) > -1) {
					if (alerts.indexOf(alert) == -1 && alert != intersectingAlert) {
						alerts.push(alert)
					}
				}
			}
		}
	}

	//
	// Set booleans
	//

	// Set hasWarnings property
	if (warnings.length || alerts.length || JSON.stringify(intersectingWarning) != '{}' || JSON.stringify(intersectingAlert) != '{}') {
		hasWarnings = true
	}

	// Set hasWarnings property
	if (JSON.stringify(intersectingWarning) != '{}' || JSON.stringify(intersectingAlert) != '{}') {
		hasIntersect = true
	}

	// Build model and return
	return {
		location,
		warnings,
		alerts,
		intersectingWarning,
		intersectingAlert,
		hasWarnings,
		hasIntersect
	}

}
