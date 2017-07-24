var map

// Custom controls

var mapContainer = document.querySelector('.map-container')

var zoom = document.createElement('div')
zoom.classList.add('map-controls','map-controls-zoom')

var view = document.createElement('div')
view.classList.add('map-controls','map-controls-view')

var key = document.createElement('div')
key.classList.add('key')

var keyContainer = document.createElement('div')
keyContainer.classList.add('key-container')

var keyCopy = document.createElement('div')
keyCopy.classList.add('key-copy')

var zoomReset = document.createElement('a')
zoomReset.setAttribute('href','#resetLoc')
zoomReset.setAttribute('title','Reset location')
zoomReset.appendChild(document.createTextNode('Zoom reset'))
zoomReset.classList.add('map-control','map-control-zoomReset')
zoom.appendChild(zoomReset)

var zoomIn = document.createElement('a')
zoomIn.setAttribute('href','#zoomIn')
zoomIn.setAttribute('title','Zoom in')
zoomIn.appendChild(document.createTextNode('Zoom in'))
zoomIn.classList.add('map-control','map-control-zoomIn')
zoom.appendChild(zoomIn)

var zoomOut = document.createElement('a')
zoomOut.setAttribute('href','#zoomOut')
zoomOut.appendChild(document.createTextNode('Zoom out'))
zoomOut.setAttribute('title','Zoom out')
zoomOut.classList.add('map-control','map-control-zoomOut')
zoom.appendChild(zoomOut)

var toggleSize = document.createElement('a')
toggleSize.setAttribute('href','#toggleSize')
toggleSize.appendChild(document.createTextNode('Full screen'))
toggleSize.setAttribute('title','Full screen')
toggleSize.classList.add('map-control','map-control-toggleSize')
view.appendChild(toggleSize)

var toggleKey = document.createElement('a')
toggleKey.setAttribute('href','#toggleKey')
toggleKey.appendChild(document.createTextNode('Key'))
toggleKey.setAttribute('title','Show key')
toggleKey.classList.add('map-control','map-control-toggleKey')
keyCopy.appendChild(document.createTextNode('Copy'))
keyContainer.appendChild(toggleKey)
keyContainer.appendChild(keyCopy)
key.appendChild(keyContainer)


/*
var satelliteView = document.createElement('a')
satelliteView.setAttribute('href','#satelliteView')
satelliteView.appendChild(document.createTextNode('Satellite view'))
satelliteView.setAttribute('title','Satellite view')
satelliteView.classList.add('map-control','map-control-satelliteView')
main.appendChild(satelliteView)
*/

mapContainer.appendChild(zoom)
mapContainer.appendChild(view)
mapContainer.appendChild(key)

// Toggle size event
toggleSize.addEventListener('click', function(e) {
    e.preventDefault()
    if (keyCopy.classList.contains('key-copy-open')) {
        keyCopy.classList.remove('key-copy-open')
        toggleKey.classList.toggle('map-control-toggleKey-open')
    }
    mapContainer.classList.toggle('map-container-full')
    mapContainer.classList.toggle('map-container-small')
    map.updateSize()
})

// Toggle key event
toggleKey.addEventListener('click', function(e) {
    e.preventDefault()
    if (mapContainer.classList.contains('map-container-small')) {
        mapContainer.classList.remove('map-container-small')
        mapContainer.classList.add('map-container-full')
    }
    toggleKey.classList.toggle('map-control-toggleKey-open')
    keyCopy.classList.toggle('key-copy-open')
    map.updateSize()
})
