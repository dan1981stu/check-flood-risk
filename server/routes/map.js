const modelData = require('../models/current')

module.exports = [
	{
		method: 'GET',
		path: '/map',
		config: {
			handler: function (request, reply) {
				const path = request.query.location ? request.query.location : ''
				const scenario = request.query.s ? request.query.s : 'a'
				const model = modelData.getSummary(path, scenario)
				const pageTitle = model.location + ' - potential affected areas - GOV.UK'
				const trace = request.query.t ? request.query.t : false
				return reply.view('map/main', {
					'model': model,
					'trace' : trace,
					'pageTitle' : pageTitle
				})
			}
		}
	}
]