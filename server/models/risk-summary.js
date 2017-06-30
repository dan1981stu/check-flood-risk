var data = require('../data/data.json')

// Get a location by its name
exports.getSummary = function(name, scenario) {

	var
		town, 
		postcode, 
		postcodes,  
		location,

		allTargetAreas = [], // By scenario
		intersectingTargetAreas = [], 
		targetAreas = [],
		alerts = [],
		warnings = [],

		intersectingWarning = {},
		intersectingAlert = {},
		intersectingTargetWarning = {},
		intersectingTargetAlert = {},

		hasTargetAreas = false, // Nearby
		hasWarnings = false, // Nearby
		hasAlerts = false, // Nearby
		hasIntersectTarget = false,
		hasIntersectWarning = false,
		hasIntersectAlert = false,
		hasIntersectAlertOrWarning = false,
		hasRisk = true

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

	// Get all target areas for scenario
	allTargetAreas = data.targetArea

	// Add intersections for postcode if applicable
	if (postcode) {
		intersectingTargetWarning = allTargetAreas.find(x => x.id == postcode.intersectingWarning)
		intersectingTargetAlert = allTargetAreas.find(x => x.id == postcode.intersectingAlert)
		if (intersectingTargetWarning) {
			hasIntersectTarget = true;
			if (intersectingTargetWarning.scenario.find(x => x[scenario] === 2)) {
				intersectingWarning = intersectingTargetWarning
				hasIntersectAlertOrWarning = true
				hasIntersectWarning = true
			}
		}
		if (intersectingTargetAlert) {
			hasIntersectTarget = true;
			if (intersectingTargetAlert.scenario.find(x => x[scenario] === 3)) {
				intersectingAlert = intersectingTargetAlert
				hasIntersectAlertOrWarning = true
				hasIntersectAlert = true
			}	
		}
	}

	// Add nearby targets, warnings and alerts for postcodes
	if (postcodes) {
		for (var key in allTargetAreas) {
			var targetArea = allTargetAreas[key]
			for (var key in postcodes) {
				if (postcodes[key].targetAreas.indexOf(targetArea.id) > -1) {
					// Add targetArea
					targetAreas.push(targetArea)
					hasTargetAreas = true
					// Add nearby warning, excluding intersecting warning
					if (warnings.indexOf(targetArea) == -1 && targetArea != intersectingTargetWarning && targetArea.scenario.find(x => x[scenario] === 2)) {
						warnings.push(targetArea)
						hasWarnings = true
					}
					// Add nearby alert, excluding one scenario 
					if (alerts.indexOf(targetArea) == -1 && targetArea.scenario.find(x => x[scenario] === 3) && !(!hasIntersectWarning && hasIntersectAlert)) {
						alerts.push(targetArea)
						hasAlerts = true
					}
				}
			}
		}
	}

	// Set risk boolean
	if (postcode && !hasIntersectTarget) {
		hasRisk = false
	}

	// Build model and return
	return {
		location,
		warnings, // Nearby warnings
		alerts, // Nearby alerts
		targetAreas, // Nearby target areas
		intersectingTargetWarning,
		intersectingWarning,
		intersectingTargetAlert,
		intersectingAlert,
		hasTargetAreas,
		hasWarnings,
		hasAlerts,
		hasIntersectTarget,
		hasIntersectWarning,
		hasIntersectAlert,
		hasIntersectAlertOrWarning,
		hasRisk
	}

}
