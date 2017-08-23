module.exports = [

	// Check flood risk - Service start page (GOV.UK)
	{
		method: 'GET',
		path: '/check-flood-risk',
		config: {
			handler: function (request, reply) {
				const scenario = request.query.s ? request.query.s : 'a'
				return reply.view('gov-uk/check-flood-risk', {
					'model' : { 'scenario' : scenario },
					'pageTitle' : 'Check flood risk - GOV.UK',
					'serviceName' : 'Check flood risk'
				})
			}
		}
	},

	// Find flood risk for planning - Service start page (GOV.UK)
	{
		method: 'GET',
		path: '/find-flood-risk-for-planning',
		config: {
			handler: function (request, reply) {
				const scenario = request.query.s ? request.query.s : 'a'
				return reply.view('gov-uk/find-flood-risk-for-planning', {
					'model' : { 'scenario' : scenario },
					'pageTitle' : 'Find flood risk for planning - GOV.UK',
					'serviceName' : 'Find flood risk for planning'
				})
			}
		}
	},

	// Get flood warnings - Service start page (GOV.UK)
	{
		method: 'GET',
		path: '/get-flood-warnings',
		config: {
			handler: function (request, reply) {
				const scenario = request.query.s ? request.query.s : 'a'
				return reply.view('gov-uk/get-flood-warnings', {
					'model' : { 'scenario' : scenario },
					'pageTitle' : 'Get flood warnings - GOV.UK',
					'serviceName' : 'Get flood warnings'
				})
			}
		}
	},

	// Report a flood - Service start page (GOV.UK)
	{
		method: 'GET',
		path: '/report-a-flood',
		config: {
			handler: function (request, reply) {
				const scenario = request.query.s ? request.query.s : 'a'
				return reply.view('gov-uk/report-a-flood', {
					'model' : { 'scenario' : scenario },
					'pageTitle' : 'Report a flood - GOV.UK',
					'serviceName' : 'Report a flood'
				})
			}
		}
	}

]
