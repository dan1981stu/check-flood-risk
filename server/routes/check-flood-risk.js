module.exports = [{
  method: 'GET',
  path: '/check-flood-risk',
  config: {
    handler: function (request, reply) {
      const location = request.query.location

      return reply.view('check-flood-risk/index', {
        pageTitle: `Live Flood Warnings for ${location} - GOV.UK`,
        location: location
      })
    }
  }
}]
