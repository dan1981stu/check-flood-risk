module.exports = [
	{
		method: 'GET',
		path: '/long-term/3-hewitt-street-hx7-5nr',
		config: {
			handler: function (request, reply) {
				return reply.view('long-term/summary', {
					'pageTitle' : '3 Hewitt Street HX7 5NR - Long term flood risk - GOV.UK'
				})
			}
		}
	},
	{
		method: 'GET',
		path: '/long-term/3-hewitt-street-hx7-5nr/assessment',
		config: {
			handler: function (request, reply) {
				return reply.view('long-term/assessment', {
					'pageTitle' : '3 Hewitt Street HX7 5NR - Flood risk assessment - GOV.UK'
				})
			}
		}
	},
	{
		method: 'GET',
		path: '/long-term/map',
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