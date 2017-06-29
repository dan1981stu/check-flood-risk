var map

// Custom controls

var mapContainer = document.querySelector('.map')

var zoom = document.createElement('div')
zoom.classList.add('map-controls','map-controls-zoom')

var main = document.createElement('div')
main.classList.add('map-controls','map-controls-main')

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
toggleSize.appendChild(document.createTextNode('Toggle size'))
toggleSize.setAttribute('title','Toggle size')
toggleSize.classList.add('map-control','map-control-toggleSize')
main.appendChild(toggleSize)

var satelliteView = document.createElement('a')
satelliteView.setAttribute('href','#satelliteView')
satelliteView.appendChild(document.createTextNode('Satellite view'))
satelliteView.setAttribute('title','Satellite view')
satelliteView.classList.add('map-control','map-control-satelliteView')
main.appendChild(satelliteView)

mapContainer.appendChild(zoom)
mapContainer.appendChild(main)

// Toggle size event
toggleSize.addEventListener('click', function(e) {
    e.preventDefault()
    mapContainer.classList.toggle('map-full')
    map.updateSize()
})

var iconFeature = new ol.Feature({
    geometry: new ol.geom.Point(
        ol.proj.fromLonLat([-1.98221629139491,53.7296721399487])
    )
});
var iconStyle = new ol.style.Style({
    image: new ol.style.Icon({
        src: '/public/images/icon-locator-blue-2x.png',
        size: [57, 71],
        anchor: [0.5, 1],
        scale: 0.5
    })
});
iconFeature.setStyle(iconStyle);
var iconSource = new ol.source.Vector({
    features: [iconFeature]
});
var iconLayer = new ol.layer.Vector({
    source: iconSource,
    defaultProjection :'EPSG:4326', 
    projection: 'EPSG:3857'
});
// Layer: Background map
var tile = new ol.layer.Tile({
    source: new ol.source.OSM()
});
map = new ol.Map({
    layers: [tile],
    target: document.getElementById('map'),
    controls: [],
    view: new ol.View({
        center: iconFeature.getGeometry().getCoordinates(),
        zoom: 14
    })
});