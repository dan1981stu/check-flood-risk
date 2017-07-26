const modelData = require('../models/warning')

module.exports = [
	{
		method: 'GET',
		path: '/warnings',
		config: {
			handler: function (request, reply) {
				const scenario = request.query.s ? request.query.s : 'a'
				const trace = request.query.t ? request.query.t : false
				const model = modelData.getWarnings('', scenario)
				return reply.view('warnings/warnings', {
					'model' : model,
					'trace' : trace,
					'pageTitle' : 'Flood alerts and warnings - Check flood risk - GOV.UK'
				})
			}
		}
	},
	/*
	{
		method: 'POST',
		path: '/warnings',
		config: {
			handler: function (request, reply) {
				const scenario = request.query.s ? request.query.s : 'a'
				const trace = request.query.t ? request.query.t : false
				const location = request.payload.location
				return reply.view('warnings/results', {
					'model' : { 'location' : location, 'scenario' : scenario },
					'trace' : trace,
					'pageTitle' : 'Flood alerts and warnings - Check flood risk - GOV.UK'
				})
			}
		}
	},
	*/
	{
		method: 'GET',
		path: '/warnings/central-mytholmroyd-river-calder',
		config: {
			handler: function (request, reply) {
				return reply.view('warnings/detail', {
					'pageTitle' : 'Central Mytholmroyd (River Calder) - Flood warning - GOV.UK'
				})
			}
		}
	}
]