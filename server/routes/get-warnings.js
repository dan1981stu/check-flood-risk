module.exports = [
	{
		method: 'GET',
		path: '/get-flood-warnings',
		config: {
			handler: function (request, reply) {
				return reply.view('get-warnings/main', {
					'serviceName' : 'Get flood warnings',
					'servicePath' : '/get-flood-warnings',
				})
			}
		}
	},
	{
		method: 'GET',
		path: '/get-flood-warnings/select-warning-areas/mytholmroyd',
		config: {
			handler: function (request, reply) {
				return reply.view('get-warnings/select-area', {
					'serviceName' : 'Get flood warnings',
					'servicePath' : '/get-flood-warnings',
					'pageTitle' : 'Select warning areas - Get flood warnings - GOV.UK'
				})
			}
		}
	},
	{
		method: 'GET',
		path: '/get-flood-warnings/add-your-contact-details',
		config: {
			handler: function (request, reply) {
				return reply.view('get-warnings/add-contact', {
					'serviceName' : 'Get flood warnings',
					'servicePath' : '/get-flood-warnings',
					'pageTitle' : 'Add your contact details - Get flood warnings - GOV.UK',
					'isSingle' : request.query.single
				})
			}
		}
	}
]