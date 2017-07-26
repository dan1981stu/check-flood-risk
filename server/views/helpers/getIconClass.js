module.exports = function (scenarios, scenarioId) {
  var severity = scenarios.find(x => x.id == scenarioId).severity
  if (severity == 1) {
    return 'icon-flood-warning-severe-large'
  } else if (severity == 2) {
    return 'icon-flood-warning-large'
  } else {
    return 'icon-flood-alert-large'
  }
}
