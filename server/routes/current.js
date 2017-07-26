const modelData = require('../models/current')

module.exports = [

	// Find location
	{
		method: 'GET',
		path: '/find-location',
		config: {
			handler: function (request, reply) {
				const scenario = request.query.s ? request.query.s : 'a'
				const trace = request.query.t ? request.query.t : false
				return reply.view('current/find-location', {
					'model' : { 'location' : '', 'scenario' : scenario },
					'trace' : trace,
					'pageTitle' : 'Find location - Check flood risk - GOV.UK'
				})
			}
		}
	},

	// Form post
	{
		method: 'POST',
		path: '/find-location',
		config: {
			handler: function (request, reply) {
				const scenario = request.payload.scenario ? request.payload.scenario : 'a'
				const location = request.payload.location
				var path = modelData.getLocationPathFromName(location, scenario)
				// Redirect to risk summary
				if (path.length > 1) {
					return reply.redirect('/' + path + '?s=' + scenario)
				}
				// Location doesn't exist in prototype
				return reply.view('current/find-location', {
					'model' : { 'location' : location, 'scenario' : scenario },
					'pageTitle' : 'Check flood risk - GOV.UK'
				})
			}
		}
	},
	
	// Location page (Risk summary)
	{
		method: 'GET',
		path: '/{location}',
		config: {
			handler: function (request, reply) {
				const path = request.params.location.toLowerCase().split(' ').join('-')
				const scenario = request.query.s ? request.query.s : 'a'
				const model = modelData.getSummary(path, scenario)
				const pageTitle = model.location + ' - Current flood risk - GOV.UK'
				const trace = request.query.t ? request.query.t : false
				if (model.hasAlertOrWarning) {
					return reply.view('current/summary-warning', {
						'model': model,
						'trace' : trace,
						'pageTitle' : pageTitle
					})
				} else {
					return reply.view('current/summary-normal', {
						'model': model,
						'trace' : trace,
						'pageTitle' : pageTitle
					})
				}
			}
		}
	}

]
