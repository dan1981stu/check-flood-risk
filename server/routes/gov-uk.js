module.exports = [

	// Flooding and extreme weather - Service start page (GOV.UK)
	{
		method: 'GET',
		path: '/flooding-extreme-weather',
		config: {
			handler: function (request, reply) {
				const scenario = request.query.s ? request.query.s : 'a'
				return reply.view('gov-uk/flooding-extreme-weather', {
					'model' : { 'scenario' : scenario },
					'pageTitle' : 'Flooding and extreme weather - GOV.UK',
					'serviceName' : ''
				})
			}
		}
	},

	// Check flood risk - Task start page (GOV.UK)
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

	// Check a propeties long term flood risk - Task start page (GOV.UK)
	{
		method: 'GET',
		path: '/check-a-propertys-flood-risk',
		config: {
			handler: function (request, reply) {
				const scenario = request.query.s ? request.query.s : 'a'
				return reply.view('gov-uk/check-a-propertys-flood-risk', {
					'model' : { 'scenario' : scenario },
					'pageTitle' : 'Check a property&apos;s long term flood risk - GOV.UK',
					'serviceName' : 'Check a property&apos;s long term flood risk'
				})
			}
		}
	},

	// Find flood risk for planning - Task start page (GOV.UK)
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

	// Get flood warnings - Task start page (GOV.UK)
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

	// Report a flood - Task start page (GOV.UK)
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
	},

	// Check if you need permission to do flood work
	{
		method: 'GET',
		path: '/permission',
		config: {
			handler: function (request, reply) {
				return reply.view('gov-uk/check-permission-to-do-flood-work', {
					'pageTitle' : 'Check permission to do flood work - GOV.UK',
					'serviceName' : ''
				})
			}
		}
	},

	// Find sandbags
	{
		method: 'GET',
		path: '/sandbags',
		config: {
			handler: function (request, reply) {
				return reply.view('gov-uk/find-sandbags', {
					'pageTitle' : 'Find out where to get sandbags - GOV.UK',
					'serviceName' : 'Find sandbags'
				})
			}
		}
	},

	// Check flood history
	{
		method: 'GET',
		path: '/check-flood-history',
		config: {
			handler: function (request, reply) {
				return reply.view('gov-uk/flood-history', {
					'pageTitle' : 'Check a property&apos;s flood history - GOV.UK',
					'serviceName' : 'Check a property&apos;s flood history'
				})
			}
		}
	}

]
