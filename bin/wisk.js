module.exports = [{
  paths: ['assets/**/*.js', 'assets/**/*.html'],
  on: {
    all: ['npm run build:js']
  }
}, {
  paths: ['assets/**/*.scss'],
  on: {
    all: ['npm run build:css']
  }
}]
