module.exports = [
	{
		method: 'GET',
		path: '/river-and-sea-levels',
		config: {
			handler: function (request, reply) {
				return reply.view('levels/main', {
					'pageTitle' : 'River and sea levels - GOV.UK'
				})
			}
		}
	},
	{
		method: 'GET',
		path: '/river-and-sea-levels/mytholmroyd',
		config: {
			handler: function (request, reply) {
				return reply.view('levels/mytholmroyd', {
					'pageTitle' : 'Mytholmroyd - River levels - GOV.UK'
				})
			}
		}
	}
]