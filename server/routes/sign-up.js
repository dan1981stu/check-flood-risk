module.exports = [
	{
		method: 'GET',
		path: '/sign-up-to-flood-warnings',
		config: {
			handler: function (request, reply) {
				return reply.view('sign-up/main')
			}
		}
	},
	{
		method: 'GET',
		path: '/sign-up-to-flood-warnings/mytholmroyd',
		config: {
			handler: function (request, reply) {
				return reply.view('sign-up/select-area')
			}
		}
	}
]