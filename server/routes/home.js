module.exports = [

	// Prototype index
	{
		method: 'GET',
		path: '/',
		config: {
			handler: function (request, reply) {
				return reply.view('home/main', {
					'pageTitle' : 'Prototype - Check flood risk'
				})
			}
		}
	},

]
