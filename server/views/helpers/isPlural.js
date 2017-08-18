module.exports = function (value, options) {
  if (value != 1) {
    return options.fn(this)
  } else {
    return options.inverse(this)
  }
}
