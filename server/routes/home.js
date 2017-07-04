const modelData = require('../models/home')

module.exports = [

	// Prototype index
	{
		method: 'GET',
		path: '/',
		config: {
			handler: function (request, reply) {
				return reply.view('home/index', {
					'pageTitle' : 'Prototype - Check flood risk'
				})
			}
		}
	},

	// Start page could be route in production
	{
		method: 'GET',
		path: '/start',
		config: {
			handler: function (request, reply) {
				const scenario = request.query.s ? request.query.s : 'a'
				const trace = request.query.t ? request.query.t : false
				return reply.view('home/main', {
					'model' : { 'location' : '', 'scenario' : scenario },
					'trace' : trace,
					'pageTitle' : 'Check flood risk - GOV.UK'
				})
			}
		}
	},
	// Form post
	{
		method: 'POST',
		path: '/start',
		config: {
			handler: function (request, reply) {
				const scenario = request.payload.scenario ? request.payload.scenario : 'a'
				const location = request.payload.location
				var path = modelData.getLocation(location, scenario)
				// Redirect to risk summary
				if (path.length > 1) {
					return reply.redirect('/' + path + '?s=' + scenario)
				}
				// Location doesn't exist in prototype
				return reply.view('home/main', {
					'model' : { 'location' : location, 'scenario' : scenario },
					'pageTitle' : 'Check flood risk - GOV.UK'
				})
			}
		}
	},
	
	// Location pages (Risk summary)
	{
		method: 'GET',
		path: '/{location}',
		config: {
			handler: function (request, reply) {
				const location = request.params.location.toLowerCase()
				const scenario = request.query.s ? request.query.s : 'a'
				const model = modelData.getSummary(location, scenario)
				const pageTitle = model.location + ' - Current flood risk - GOV.UK'
				const trace = request.query.t ? request.query.t : false
				if (model.hasAlertOrWarning) {
					return reply.view('home/risk-summary-warning', {
						'model': model,
						'trace' : trace,
						'pageTitle' : pageTitle
					})
				} else {
					return reply.view('home/risk-summary-normal', {
						'model': model,
						'trace' : trace,
						'pageTitle' : pageTitle
					})
				}
			}
		}
	}
]
