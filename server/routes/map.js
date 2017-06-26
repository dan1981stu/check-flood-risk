module.exports = [
	{
		method: 'GET',
		path: '/map',
		config: {
			handler: function (request, reply) {

				var location;
				switch(request.query.location) {
					case 'central-mytholmroyd-river-calder':
						location = 'Central Mytholmroyd (River Calder)'
						break
					case 'mytholmroyd':
						location = 'Mytholmroyd'
						break
					default:
						location = false
				}

				return reply.view('map/main', {
					'location' : location,
					'pageTitle' : 'Mytholomroyd - potential affected areas - GOV.UK'
				})
			}
		}
	}
]