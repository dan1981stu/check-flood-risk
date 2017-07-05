var data = require('../data/data.json')

// Get risk summary by location and scenario
exports.getSummary = function(name, scenario) {

	var
		town, 
		postcode, 
		postcodes,  
		location,
		lonLat, // Of location

		intersectingTargetAreas = [], 
		intersectingTarget = {},
		warningsSevere = [], // Nearby
		warnings = [], // Nearby
		alerts = [], // Nearby
		targetAreas = [], // Nearby
		levels = [], // Levels for impact area
		impacts = [], // Current impacts in this area
		levelState = 'within normal',

		hasPostcode = false,
		hasRisk = true,
		hasImpacts = false,

		hasWarningSevere = false, // Nearby
		hasWarning = false, // Nearby
		hasAlert = false, // Nearby
		hasAlertOrWarning = false, // Nearby
		hasTargetArea = false, // Nearby

		hasIntersectWarningSevere = false,
		hasIntersectWarning = false,
		hasIntersectAlert = false,
		hasIntersectAlertOrWarning = false,
		hasIntersectTarget = false

		targetStates = []

	// Find in towns
	town = data.town.find(
		x => x.name.toLowerCase() === name.toLowerCase().split('-').join(' ')
	)

	// If town find all postcodes for location
	if (town) {
		postcodes = data.postcode.filter(x => x.townId === town.id)
		lonLat = town.lonLat
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
		lonLat = postcode.lonLat
		hasPostcode = true
	}

	// Add intersections for postcode if applicable
	if (postcode) {
		var intersectingTargetWarning = data.targetArea.find(x => x.id == postcode.intersectingWarning)
		var intersectingTargetAlert = data.targetArea.find(x => x.id == postcode.intersectingAlert)
		if (intersectingTargetAlert) {
			// Intersets with an target alert area
			hasIntersectTarget = true
			if (intersectingTargetAlert.scenario.find(x => x.id == scenario && x.severity == 3)) {
				// Intersects with a current alert
				intersectingTarget = intersectingTargetAlert
				hasIntersectAlertOrWarning = true
				hasIntersectAlert = true
				hasAlertOrWarning = true
				targetStates.push({ "id" : intersectingTarget.id, "state" : 3 })
			}	
		}
		if (intersectingTargetWarning) {
			// Intersets with an target warning area
			hasIntersectTarget = true
			if (intersectingTargetWarning.scenario.find(x => x.id == scenario && x.severity == 1)) {
				// Intersects with a current severe warning
				intersectingTarget = intersectingTargetWarning
				hasIntersectAlertOrWarning = true
				hasIntersectWarningSevere = true
				hasAlertOrWarning = true
				targetStates.push({ "id" : intersectingTarget.id, "state" : 1 })
			} else if (intersectingTargetWarning.scenario.find(x => x.id == scenario && x.severity == 2)) {
				// Intersects with a current warning
				intersectingTarget = intersectingTargetWarning
				hasIntersectAlertOrWarning = true
				hasIntersectWarning = true
				hasAlertOrWarning = true
				targetStates.push({ "id" : intersectingTarget.id, "state" : 2 })
			}
		}
	}

	// Add nearby targets, severe warnings, warnings and alerts for postcodes
	if (postcodes) {
		for (var key in data.targetArea) {
			var targetArea = data.targetArea[key]
			for (var key in postcodes) {
				if (postcodes[key].targetAreas.indexOf(targetArea.id) > -1) {
					// Add nearby severe warning, excluding intersecting severe warning
					if (warningsSevere.indexOf(targetArea) == -1 && targetArea != intersectingTarget && targetArea.scenario.find(x => x.id == scenario && x.severity == 1)) {
						targetAreas.push(targetArea)
						warningsSevere.push(targetArea)
						targetStates.push({ "id" : targetArea.id, "state" : 1 })
						hasWarningSevere = true
						hasAlertOrWarning = true
						hasTargetArea = true
					}
					// Add nearby warning, excluding intersecting warning
					if (warnings.indexOf(targetArea) == -1 && targetArea != intersectingTarget && targetArea.scenario.find(x => x.id == scenario && x.severity == 2)) {
						warnings.push(targetArea)
						targetAreas.push(targetArea)
						targetStates.push({ "id" : targetArea.id, "state" : 2 })
						hasWarning = true
						hasAlertOrWarning = true
						hasTargetArea = true
					}
					// Add nearby alert, excluding 1/4 scenario 
					if (alerts.indexOf(targetArea) == -1 && targetArea.scenario.find(x => x.id == scenario && x.severity == 3) && !(!hasIntersectWarning && !hasIntersectWarningSevere && hasIntersectAlert)) {
						alerts.push(targetArea)
						targetAreas.push(targetArea)
						targetStates.push({ "id" : targetArea.id, "state" : 3 })
						hasAlert = true
						hasAlertOrWarning = true
						hasTargetArea = true
					}
				}
			}
		}
	}

	// Set risk boolean
	if (postcode && !hasIntersectTarget) {
		hasRisk = false
	}

	// Add river levels and set general level state (Normal, above or below)
	for (var key in data.level) {
		var level = data.level[key]
		for (var key in targetAreas) {
			var targetArea = targetAreas[key]
			if (targetArea.levels.indexOf(level.id) > -1 && levels.indexOf(level) == -1) {
				// Add level
				levels.push(level)
				var state = level.scenario.find(x => x.id == scenario).state
				if (state == 'above') {
					levelState = 'above normal'
				} else if (state == 'below') {
					levelState = 'below normal'
				}
			}
		}
	}

	// Add impacts
	if (levels.length) {
		for (var key in data.impact) {
			var impact = data.impact[key]
			var levelTrigger = levels.find(x => x.id == impact.levelId)
			var impactTargetArea = data.targetArea.find(x => x.id == impact.targetAreaId)

			// Check for nearby level and target area
			if (levelTrigger && impactTargetArea) {
				// Check level trigger is above normal range
				if(levelTrigger.scenario.find(x => x.id == scenario).state == 'above') {
					impacts.push(impact)
					hasImpacts = true
				}
			}
		}
	}

	// Build model and return
	return {

		scenario,
		location, // Full location name
		warningsSevere, // List of nearby severe warnings
		warnings, // List of nearby warnings
		alerts, // List of nearby alerts
		targetAreas, // List of nearby target areas
		intersectingTarget, // The intersecting target area

		levelState,
		impacts,

		hasRisk,
		hasPostcode,
		
		hasWarningSevere,
		hasWarning,
		hasAlert,
		hasAlertOrWarning,
		hasTargetArea,

		hasIntersectWarningSevere,
		hasIntersectWarning,
		hasIntersectAlert,
		hasIntersectAlertOrWarning,
		hasIntersectTarget,
		
		hasImpacts,

		targetStates,
		lonLat

	}

}

// Get a location by its name and scenario
exports.getLocation = function(name, scenario) {

	var location

	// Find in towns
	location = data.town.find(
		x => x.name.toLowerCase() === name.toLowerCase()
	)
	// If not a town check postcodes
	if (!location) {
		location = data.postcode.find(
			x => x.name.toLowerCase() === name.toLowerCase()
		)
	}
	// If location exists build model and return
	if (location) {	
		return location.path
	}
	return ''

}