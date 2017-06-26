module.exports = [
	{
		method: 'GET',
		path: '/map',
		config: {
			handler: function (request, reply) {
				return reply.view('map/main')
			}
		}
	}
]