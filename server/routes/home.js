const modelData = require('../models/risk-summary')

module.exports = [
	{
		method: 'GET',
		path: '/',
		config: {
			handler: function (request, reply) {
				return reply.view('home/main')
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
				if (model.hasWarnings) {
					return reply.view('home/risk-summary-warnings', {
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
