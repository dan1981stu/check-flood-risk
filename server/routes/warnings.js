module.exports = [
	{
		method: 'GET',
		path: '/warnings',
		config: {
			handler: function (request, reply) {
				return reply.view('warnings/main')
			}
		}
	},
	{
		method: 'GET',
		path: '/warnings/central-mytholmroyd-river-calder',
		config: {
			handler: function (request, reply) {
				return reply.view('warnings/central-mytholmroyd-river-calder', {
					'pageTitle' : 'Central Mytholmroyd (River Calder) - Flood warning - GOV.UK'
				})
			}
		}
	}
]