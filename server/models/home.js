var data = require('../data/data.json')

// Get a location by its name
exports.getSummary = function(name, scenario) {

	var
		town, 
		postcode, 
		postcodes,  
		location,

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
		hasPostcode = true;
	}

	// Add intersections for postcode if applicable
	if (postcode) {
		var intersectingTargetWarning = data.targetArea.find(x => x.id == postcode.intersectingWarning)
		var intersectingTargetAlert = data.targetArea.find(x => x.id == postcode.intersectingAlert)
		if (intersectingTargetAlert) {
			hasIntersectTarget = true
			if (intersectingTargetAlert.scenario.find(x => x.id == scenario && x.severity == 3)) {
				intersectingTarget = intersectingTargetAlert
				hasIntersectAlertOrWarning = true
				hasIntersectAlert = true
				hasAlertOrWarning = true
			}	
		}
		if (intersectingTargetWarning) {
			hasIntersectTarget = true
			if (intersectingTargetWarning.scenario.find(x => x.id == scenario && x.severity == 1)) {
				intersectingTarget = intersectingTargetWarning
				hasIntersectAlertOrWarning = true
				hasIntersectWarningSevere = true
				hasAlertOrWarning = true
			} else if (intersectingTargetWarning.scenario.find(x => x.id == scenario && x.severity == 2)) {
				intersectingTarget = intersectingTargetWarning
				hasIntersectAlertOrWarning = true
				hasIntersectWarning = true
				hasAlertOrWarning = true
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
						warningsSevere.push(targetArea)
						hasWarningSevere = true
						hasAlertOrWarning = true
						targetAreas.push(targetArea)
						hasTargetArea = true
					}
					// Add nearby warning, excluding intersecting warning
					if (warnings.indexOf(targetArea) == -1 && targetArea != intersectingTarget && targetArea.scenario.find(x => x.id == scenario && x.severity == 2)) {
						warnings.push(targetArea)
						hasWarning = true
						hasAlertOrWarning = true
						targetAreas.push(targetArea)
						hasTargetArea = true
					}
					// Add nearby alert, excluding 1/4 scenario 
					if (alerts.indexOf(targetArea) == -1 && targetArea.scenario.find(x => x.id == scenario && x.severity == 3) && !(!hasIntersectWarning && !hasIntersectWarningSevere && hasIntersectAlert)) {
						alerts.push(targetArea)
						hasAlert = true
						hasAlertOrWarning = true
						targetAreas.push(targetArea)
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
			var impactImpactTargetArea = targetAreas.find(x => x.id == impact.targetAreaId)
			// Check for nearby level and target area
			if (levelTrigger && impactImpactTargetArea) {
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
		
		hasImpacts

	}

}
