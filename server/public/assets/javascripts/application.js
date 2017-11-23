// Prototype wide javascript

var application = {};
(function(){

  var navBack = document.getElementsByClassName('nav-back')
  if (navBack.length) {
    console.log(navBack.length)
    navBack[0].style.display = 'block'
    navBack[0].removeAttribute('hidden')
    e.preventDefault()
    navBack[0].addEventListener('click', {
      console.log('click')
      //window.history.back()
    })
  }

}).call(application);

