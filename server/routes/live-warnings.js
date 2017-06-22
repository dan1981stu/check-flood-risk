module.exports = [{
  method: 'GET',
  path: '/live-warnings',
  config: {
    handler: function (request, reply) {
      const location = request.query.location

      if (location) {
        return reply.view('live-warnings/local', {
          pageTitle: `Live Flood Warnings for ${location} - GOV.UK`,
          location: location
        })
      } else {
        return reply.view('live-warnings/index', {
          pageTitle: 'Live Flood Warnings - GOV.UK'
        })
      }
    }
  }
}]
