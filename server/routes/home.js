module.exports = [
	{
		method: 'GET',
		path: '/',
		config: {
			handler: function (request, reply) {
				return reply.view('home/main')
			}
		}
	},
	
	// Location pages (Risk summary)
	{
		method: 'GET',
		path: '/{location}',
		config: {
			handler: function (request, reply) {
				const location = request.params.location.toLowerCase()
				return reply.view('location/' + location)
			}
		}
	}
]
