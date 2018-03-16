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
					'serviceName' : ''
				})
			}
		}
	},

	// Check a propeties long term flood risk - Task start page (GOV.UK)
	{
		method: 'GET',
		path: '/get-property-flood-risk-assessment',
		config: {
			handler: function (request, reply) {
				const scenario = request.query.s ? request.query.s : 'a'
				return reply.view('gov-uk/get-property-flood-risk-assessment', {
					'model' : { 'scenario' : scenario },
					'pageTitle' : 'Get a property&#39;s flood risk assessment - GOV.UK',
					'serviceName' : ''
				})
			}
		}
	},

	// Find flood risk for planning - Task start page (GOV.UK)
	{
		method: 'GET',
		path: '/guidance/flood-risk-assessment-for-planning-applications',
		config: {
			handler: function (request, reply) {
				const scenario = request.query.s ? request.query.s : 'a'
				return reply.view('gov-uk/flood-risk-assessment-for-planning', {
					'model' : { 'scenario' : scenario },
					'pageTitle' : 'Flood risk assessment for planning applications - GOV.UK',
					'serviceName' : '',
					'isGuidance' : true
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
					'serviceName' : ''
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
					'serviceName' : ''
				})
			}
		}
	},

	// Check if you need permission to do flood work
	{
		method: 'GET',
		path: '/check-permission-to-do-flood-work',
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
	},

	// Prepare
	{
		method: 'GET',
		path: '/prepare-for-flooding',
		config: {
			handler: function (request, reply) {
				return reply.view('gov-uk/prepare-for-flooding', {
					'pageTitle' : 'Preparing for a flood - GOV.UK',
					'pageDescription' : 'What to do before a flood.',
					'serviceName' : ''
				})
			}
		}
	},

	// Respond
	{
		method: 'GET',
		path: '/respond-to-flooding',
		config: {
			handler: function (request, reply) {
				return reply.view('gov-uk/respond-to-flooding', {
					'pageTitle' : 'Responding to a flood - GOV.UK',
					'pageDescription' : 'What to do during a flood.',
					'serviceName' : ''
				})
			}
		}
	},

	// Recover
	{
		method: 'GET',
		path: '/recover-from-flooding',
		config: {
			handler: function (request, reply) {
				return reply.view('gov-uk/recover-from-flooding', {
					'pageTitle' : 'Recovering from a flood - GOV.UK',
					'pageDescription' : 'What to do after a flood.',
					'serviceName' : ''
				})
			}
		}
	}

]
