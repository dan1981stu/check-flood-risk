
// Preset values

var defaultBoundingBox = [[-5.72,49.96],[1.77,55.81]]
var minIconResolution = 300

// Setup fullscreen container and key elements

var mapContainer = document.querySelector('.map').children[0]
var mapContainerInner = document.createElement('div')
mapContainerInner.classList.add('map-container-inner')
mapContainerInner.id = 'map-container-inner'

var copyright = document.createElement('span')
copyright.innerHTML = '\u00A9 <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
copyright.classList.add('map-key-copyright')

mapContainer.appendChild(mapContainerInner)

// Reference require to redraw map
var map

var init = function() {

    // Function used to style individual features
    var styleFunction = function(feature, resolution) {

        return style;
    };

    // Layer: Background map
    var tile = new ol.layer.Tile({
        source: new ol.source.OSM()
    });

    // The map view object
    var view = new ol.View({
        center: ol.proj.fromLonLat(centre),
        enableRotation: false,
        zoom: 17
    });

    // Zoom buttons

    var zoomElement = document.createElement('button')
    zoomElement.appendChild(document.createTextNode('Zoom'))
    zoomElement.className = 'ol-zoom'
    var zoom = new ol.control.Zoom({
        element: zoomElement
    })

    // Fullscreen button

    var fullScreenElement = document.createElement('button')
    fullScreenElement.appendChild(document.createTextNode('Full screen'))
    var fullScreen = new ol.control.FullScreen({
        element: fullScreenElement
    })

    // Zoom reset button

    var zoomResetElement = document.createElement('button')
    zoomResetElement.appendChild(document.createTextNode('Zoom reset'))
    zoomResetElement.className = 'ol-zoom-reset'
    zoomResetElement.setAttribute('title','Reset location')
    var zoomReset = new ol.control.Control({
        element: zoomResetElement
    })

    // Interactions

    var interactions = ol.interaction.defaults({
        altShiftDragRotate:false, 
        pinchRotate:false
    })

    // Add and remove controls

    var controls = ol.control.defaults({
        zoom: false,
        rotate: false,
        attribution: false
    }).extend([
        fullScreen,
        zoomReset,
        zoom
    ])

    // Render map
    map = new ol.Map({
        target: 'map-container-inner',
        interactions: interactions,
        controls: controls,
        layers: [tile],
        view: view
    })

    //
    // Map events
    //

    // Full screen event

    var fullScreenHandler = function () {
        map.updateSize()
    }

    document.addEventListener('fullscreenchange', fullScreenHandler)
    document.addEventListener('webkitfullscreenchange', fullScreenHandler)
    document.addEventListener('mozfullscreenchange', fullScreenHandler)
    document.addEventListener('MSFullscreenChange', fullScreenHandler)

    // Apple greyscale filter.
    tile.on('postcompose', function(e) {
        greyscale(e.context)
    })

}

init()

// Function to get query string parameter
function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

// Function applies greyscale to every pixel in canvas
// Ref: http://jsfiddle.net/geraldo/vyde6f83/3/
function greyscale(context) {
    var width = context.canvas.width
    var height = context.canvas.height
    var inputData = context.getImageData(0, 0, width, height).data
    var canvas = document.getElementsByClassName('ol-unselectable')[0]
    var ctx = canvas.getContext('2d')
    ctx.fillStyle = 'rgba(0, 0, 0, 0)'
    var myImageData = ctx.createImageData(width, height)
    var d = myImageData.data
    for (i = 0; i < inputData.length; i += 4) {
        var r = inputData[i]
        var g = inputData[i + 1]
        var b = inputData[i + 2]
        var v = 0.2126 * r + 0.7152 * g + 0.0722 * b
        d[i + 0] = v
        d[i + 1] = v
        d[i + 2] = v
        d[i + 3] = 255
    }
}