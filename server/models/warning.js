var data = require('../data/data.json')

// Get risk summary by location and scenario
exports.getWarnings = function(search, scenario) {

	var filterMin = 1

	var
		town, 
		postcode, 
		postcodes,  
		location,
		lonLat = [], // Of location

		warningsSevere = [], // Nearby
		warnings = [], // Nearby
		alerts = [], // Nearby
		warningsRemoved = [], // Nearby

		hasPostcode = false,

		hasWarningSevere = false, // Nearby
		hasWarning = false, // Nearby
		hasAlert = false, // Nearby
		hasAlertOrWarning = false, // Nearby
		hasWarningRemoved = true, //Nearby
		hasFilter = false, // Filter required

		targetAreaStates = []

	if (search.length) {

		// Find in towns
		town = data.town.find(
			x => x.name === search.toLowerCase()
		)

		// If town find all postcodes for location
		if (town) {
			postcodes = data.postcode.filter(x => x.townId === town.id)
			lonLat = town.lonLat
		}

		// If postcode find in postcodes
		if (!town) {
			postcode = data.postcode.find(
				x => x.name === search.toLowerCase()
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
			lonLat = postcode.lonLat
			hasPostcode = true
		}

		// Add nearby severe warnings, warnings and alerts for postcodes
		if (postcodes) {
			for (var key in data.targetArea) {
				var targetArea = data.targetArea[key]
				for (var key in postcodes) {
					if (postcodes[key].targetAreas.indexOf(targetArea.id) > -1) {
						// Add nearby severe warning, excluding intersecting severe warning
						if (warningsSevere.indexOf(targetArea) == -1 && targetArea.scenario.find(x => x.id == scenario && x.severity == 1)) {
							warningsSevere.push(targetArea)
							targetAreaStates.push({ "id" : targetArea.id, "state" : 1 })
							hasWarningSevere = true
						}
						// Add nearby warning, excluding intersecting warning
						if (warnings.indexOf(targetArea) == -1 && targetArea.scenario.find(x => x.id == scenario && x.severity == 2)) {
							warnings.push(targetArea)
							targetAreaStates.push({ "id" : targetArea.id, "state" : 2 })
							hasWarning = true
						}
						// Add nearby alert, excluding 1/4 scenario 
						if (alerts.indexOf(targetArea) == -1 && targetArea.scenario.find(x => x.id == scenario && x.severity == 3)) {
							alerts.push(targetArea)
							targetAreaStates.push({ "id" : targetArea.id, "state" : 3 })
							hasAlert = true
						}
					}
				}
			}
		}
	}

	// Add all severe warnings, warnings and alerts
	else {

		for (var key in data.targetArea) {
			var targetArea = data.targetArea[key]
			// Add severe warning
			if (targetArea.scenario.find(x => x.id == scenario && x.severity == 1)) {
				warningsSevere.push(targetArea)
				targetAreaStates.push({ "id" : targetArea.id, "state" : 1 })
				hasWarningSevere = true
			}
			// Add warning
			if (targetArea.scenario.find(x => x.id == scenario && x.severity == 2)) {
				warnings.push(targetArea)
				targetAreaStates.push({ "id" : targetArea.id, "state" : 2 })
				hasWarning = true
			}
			// Add alert 
			if (targetArea.scenario.find(x => x.id == scenario && x.severity == 3)) {
				alerts.push(targetArea)
				targetAreaStates.push({ "id" : targetArea.id, "state" : 3 })
				hasAlert = true
			}
		}

	}

	// Set has alert or warning boolean
	if (hasAlert || hasWarning || hasWarningSevere) {
		hasAlertOrWarning = true
	}

	// Set has filter boolean
	if (targetAreaStates.length >= filterMin) {
		hasFilter = true
	}

	// Build model and return
	return {

		scenario,
		search, // Url parameter
		location, // Full location name
		warningsSevere, // List of nearby severe warnings
		warnings, // List of nearby warnings
		alerts, // List of nearby alerts
		warningsRemoved, // List of nearby warnings removed
				
		hasWarningSevere,
		hasWarning,
		hasAlert,
		hasAlertOrWarning,
		hasWarningRemoved,
		hasFilter,

		targetAreaStates

	}

}