module.exports = [
	{
		method: 'GET',
		path: '/flood-risk-assessment/find-location',
		config: {
			handler: function (request, reply) {
				return reply.view('planning/location', {
					'serviceName' : 'Check flood zone',
					'pageTitle' : 'Find location - Check flood zone - GOV.UK'
				})
			}
		}
	},
	{
		method: 'GET',
		path: '/flood-risk-assessment/identify-boundary',
		config: {
			handler: function (request, reply) {
				return reply.view('planning/site', {
					'serviceName' : 'Check flood zone',
					'pageTitle' : 'Identify boundary - Check flood zone - GOV.UK'
				})
			}
		}
	}
]