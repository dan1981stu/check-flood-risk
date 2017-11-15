module.exports = [
	{
		method: 'GET',
		path: '/find-address',
		config: {
			handler: function (request, reply) {
				return reply.view('property/find-address', {
					'pageTitle' : 'Find address - Long term flood risk - GOV.UK'
				})
			}
		}
	},
	{
		method: 'POST',
		path: '/select-address',
		config: {
			handler: function (request, reply) {
				return reply.view('property/select-address', {
					'pageTitle' : 'Select property - Long term flood risk - GOV.UK'
				})
			}
		}
	},
	{
		method: 'GET',
		path: '/property/3-hewitt-street-hx7-5nr',
		config: {
			handler: function (request, reply) {
				return reply.view('property/summary', {
					'pageTitle' : '3 Hewitt Street HX7 5NR - Long term flood risk - GOV.UK'
				})
			}
		}
	},
	{
		method: 'GET',
		path: '/property/3-hewitt-street-hx7-5nr/assessment',
		config: {
			handler: function (request, reply) {
				return reply.view('property/assessment', {
					'pageTitle' : '3 Hewitt Street HX7 5NR - Flood risk assessment - GOV.UK'
				})
			}
		}
	},
	{
		method: 'GET',
		path: '/property/map',
		config: {
			handler: function (request, reply) {
				return reply.view('long-term/map', {
					'location': request.query.location,
					'pageTitle' : '3 Hewitt Street HX7 5NR - Map showing long risk - GOV.UK'
				})
			}
		}
	}
]