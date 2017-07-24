const modelData = require('../models/home')

module.exports = [

	// Service start page (GOV.UK)
	{
		method: 'GET',
		path: '/check-flood-risk',
		config: {
			handler: function (request, reply) {
				const scenario = request.query.s ? request.query.s : 'a'
				return reply.view('gov-uk/check-flood-risk', {
					'model' : { 'scenario' : scenario },
					'pageTitle' : '',
					'serviceName' : ''
				})
			}
		}
	}

]
