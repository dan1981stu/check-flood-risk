module.exports = [
	{
		method: 'GET',
		path: '/river-and-sea-levels',
		config: {
			handler: function (request, reply) {
				return reply.view('levels/main', {
					'location': request.query.location,
					'pageTitle' : 'Mytholmroyd - River levels - GOV.UK'
				})
			}
		}
	},
	{
		method: 'GET',
		path: '/river-and-sea-levels/river-calder-at-mytholmroyd',
		config: {
			handler: function (request, reply) {

				var location;
				switch(request.query.location) {
					case 'mytholmroyd':
						location = 'Mytholmroyd'
						break
					default:
						location = false
				}

				return reply.view('levels/river-calder-mytholmroyd', {
					'location': location,
					'pageTitle' : 'River Calder at Mytholmroyd - River level - GOV.UK'
				})
			}
		}
	}
]