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
				const trace = request.query.t ? request.query.t : false
				return reply.view('home/risk-summary', {
					'model': modelData.getSummary(location, scenario),
					'trace' : trace,
					'pageTitle' : ' data.name' + ' - Current flood risk - GOV.UK'
				})
			}
		}
	}
]
