const modelData = require('../models/current')

module.exports = [

	// Find location
	{
		method: 'GET',
		path: '/5-day-forecast',
		config: {
			handler: function (request, reply) {
				const scenario = request.query.s ? request.query.s : 'a'
				const trace = request.query.t ? request.query.t : false
				return reply.view('five-day/main', {
					'model' : { 'location' : '', 'scenario' : scenario },
					'trace' : trace,
					'pageTitle' : '5 day forecast - Check flood risk - GOV.UK'
				})
			}
		}
	}

]
