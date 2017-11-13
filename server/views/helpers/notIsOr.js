module.exports = function (condition1, condition2, options) {
  if(!(condition1 && condition2)) {
      return options.fn(this)
    }
  return options.inverse(this)
}
