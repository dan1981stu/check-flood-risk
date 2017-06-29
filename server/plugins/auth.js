const users = {
  flood: {
    id: 1,
    username: 'flood',
    password: 'prototype'
  }
}

const validate = function (request, username, password, callback) {
  const user = users[username]
  if (!user) {
    return callback(null, false)
  }

  const isValid = password === user.password

  callback(null, isValid, user)
}

exports.register = function (server, options, next) {
  server.auth.strategy('simple', 'basic', true, { validateFunc: validate })
  next()
}

exports.register.attributes = {
  name: 'auth'
}
