module.exports = [{
  method: 'GET',
  path: '/',
  config: {
    handler: function (request, reply) {
      return reply.view('home/main')
    }
  }
}, {
  method: 'GET',
  path: '/v1',
  config: {
    handler: function (request, reply) {
      return reply.view('home/v1')
    }
  }
}, {
  method: 'GET',
  path: '/v2',
  config: {
    handler: function (request, reply) {
      const location = request.query.location

      return reply.view('home/v2', {
        pageTitle: `Live Flood Warnings for ${location} - GOV.UK`,
        location: location
      })
    }
  }
}]
