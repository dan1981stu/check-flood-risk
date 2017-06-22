const Lab = require('lab')
const Code = require('code')
const lab = exports.lab = Lab.script()
const composeServer = require('..')

lab.experiment('Application test', function () {
  var server

  // Start the server before each test
  lab.before((done) => {
    console.log('Composing server')
    composeServer(function (err, svr) {
      if (err) {
        return done(err)
      }

      console.log('Server composed')
      server = svr
      server.initialize(done)
    })
  })

  // Test robots.txt
  lab.test('Public robots.txt returns 200 OK', function (done) {
    var options = {
      method: 'GET',
      url: '/public/robots.txt'
    }

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(200)
      server.stop(done)
    })
  })

  // Test an unknown url
  lab.test('Unknown url returns 404 Not Found', function (done) {
    var options = {
      method: 'GET',
      url: '/jksfds'
    }

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(404)
      server.stop(done)
    })
  })
})

