module.exports = [
	{
		method: 'GET',
		path: '/river-and-sea-levels',
		config: {
			handler: function (request, reply) {
				return reply.view('levels/main')
			}
		}
	},
	{
		method: 'GET',
		path: '/river-and-sea-levels/mytholmroyd',
		config: {
			handler: function (request, reply) {
				return reply.view('levels/mytholmroyd')
			}
		}
	}
]