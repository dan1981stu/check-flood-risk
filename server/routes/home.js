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
				const data = modelData[location]
				return reply.view('home/risk-summary', {
					'model': data,
					'pageTitle' : data.name + ' - Current flood risk - GOV.UK'
				})
			}
		}
	}
]
