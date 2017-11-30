
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

// Add key

var key = document.createElement('div')
key.classList.add('map-key')

var keyToggle = document.createElement('button')
keyToggle.innerHTML = '<span>Show key</span>'
keyToggle.setAttribute('title','Find out what the features are')
keyToggle.classList.add('map-control','map-control-key')
keyToggle.addEventListener('click', function(e) {
    e.preventDefault()
    key.classList.toggle('map-key-open')
})

var keyCopy = document.createElement('div')
keyCopy.classList.add('map-key-copy')

var copyright = document.createElement('span')
copyright.innerHTML = '\u00A9 <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
copyright.classList.add('map-key-copyright')

//keyCopy.appendChild(document.createTextNode('Symbols and explanations'))
keyCopy.innerHTML = '<h2 class="bold-medium">Map key</h2>'
keyCopy.appendChild(copyright)

key.appendChild(keyToggle)
key.appendChild(keyCopy)

mapContainerInner.appendChild(key)

// Add inner comtainer
mapContainer.appendChild(mapContainerInner)

// Reference require to redraw map
var map

var init = function() {

    // Function used to style individual features
    var styleFunction = function(feature, resolution) {
        return style;
    }

    // Drawing styles
    var styleDraw = new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.5)'
        }),
        stroke: new ol.style.Stroke({
            color: '#005EA5',
            width: 3
        }),
        image: new ol.style.Icon({
            opacity: 1,
            size: [32,32],
            scale: 0.5,
            src: '/public/map-draw-cursor-2x.png'
        })
    })
    var styleDrawComplate = new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.5)'
        }),
        stroke: new ol.style.Stroke({
            color: '#B10E1E',
            width: 3
        }),
        image: new ol.style.Icon({
            opacity: 1,
            size : [32,32],
            scale: 0.5,
            src: '/public/map-draw-cursor-2x.png'
        })
    })
    var styleDrawComplateGeometry = new ol.style.Style({
        image: new ol.style.Icon({
            opacity: 1,
            size : [32,32],
            scale: 0.5,
            src: '/public/map-draw-cursor-2x.png'
        }),
        geometry: function(feature) {
          // return the coordinates of the first ring of the polygon
          var coordinates = feature.getGeometry().getCoordinates()[0];
          return new ol.geom.MultiPoint(coordinates);
        }
    })
    var styleDrawModify = new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.5)'
        }),
        stroke: new ol.style.Stroke({
            color: '#FFBF47',
            width: 3
        }),
        image: new ol.style.Icon({
            opacity: 1,
            size : [32,32],
            scale: 0.5,
            src: '/public/map-draw-cursor-2x.png'
        })
    })

    // Layer: Background map
    var tile = new ol.layer.Tile({
        source: new ol.source.OSM()
    })

    // Layer: Polygon vector
    var source = new ol.source.Vector()
    var vector = new ol.layer.Vector({
        source: source,
        style: [styleDrawComplate, styleDrawComplateGeometry]
    })

    // The map view object
    var view = new ol.View({
        center: ol.proj.fromLonLat(centre),
        enableRotation: false,
        zoom: 15
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
    fullScreenElement.className = 'ol-full-screen'
    fullScreenElement.addEventListener('click', function(e) {
        e.preventDefault()
        mapContainer.classList.toggle('map-container-fullscreen')
        this.classList.toggle('ol-full-screen-open')
        map.updateSize()
    })
    var fullScreen = new ol.control.Control({ // Use fullscreen for HTML Fullscreen API
        element: fullScreenElement
    })

    // Draw reset button

    var drawResetElement = document.createElement('button')
    drawResetElement.innerHTML = 'Clear<span> drawing</span>'
    drawResetElement.className = 'ol-draw-reset'
    drawResetElement.setAttribute('title','Clear this drawing')
    drawResetElement.disabled = true
    drawResetElement.addEventListener('click', function(e) {
        e.preventDefault()
        this.disabled = true
        drawStartElement.disabled = false
        // Remove previously drawn features
        vector.getSource().clear()
    })
    var drawReset = new ol.control.Control({
        element: drawResetElement
    })

    // Interactions
    var interactions = ol.interaction.defaults({
        altShiftDragRotate:false, 
        pinchRotate:false,
        doubleClickZoom :false
    })
    var modify = new ol.interaction.Modify({
        source: source,
        style: styleDrawModify
    })
    var draw = new ol.interaction.Draw({
        source: source,
        type: 'Polygon',
        style: styleDraw
    })
    var snap = new ol.interaction.Snap({
        source: source
    })

    // Draw start button

    var drawStartElement = document.createElement('button')
    drawStartElement.innerHTML = 'Start<span> drawing</span>'
    drawStartElement.className = 'ol-draw-start'
    drawStartElement.setAttribute('title','Start drawing')
    drawStartElement.addEventListener('click', function(e) {
        e.preventDefault()
        map.addInteraction(draw)
        map.addInteraction(snap)
        map.addInteraction(modify)
        this.disabled = true
    })
    var drawStart = new ol.control.Control({
        element: drawStartElement
    })

    // Add and remove controls
    var controls = ol.control.defaults({
        zoom: false,
        rotate: false,
        attribution: false
    }).extend([
        drawReset,
        drawStart,
        fullScreen,
        zoom
    ])

    // Render map
    map = new ol.Map({
        target: 'map-container-inner',
        interactions: interactions,
        controls: controls,
        layers: [tile, vector],
        view: view
    })

    //
    // Map events
    //

    // Close key if map is clicked
    map.on('click', function(e) {
        console.log('Map clicked')
        var keyOpen = document.getElementsByClassName('map-key-open')
        if (keyOpen.length) {
            keyOpen[0].classList.remove('map-key-open')   
        }
        // Get layer if needed
        /*
        map.forEachLayerAtPixel(e.pixel, function(layer){ 
            if( layer === tile ) {
            } 
        })
        */
    })

    // Deactivate draw interaction after first polygon
    draw.on('drawend', function (e) {
        map.removeInteraction(draw)
    })

    // Finish drawing on escape
    draw.on('drawstart', function(e) {
        document.addEventListener('keyup', function() {
            if (event.keyCode === 27) {
                draw.finishDrawing()
            }
        })
    })

    // Feature added
    source.on('addfeature', function (e) {
        var feature = e.feature
        var coordinates = feature.getGeometry().getCoordinates()[0]
        // Feature too small
        if (coordinates.length < 4) {
            source.removeFeature(feature)
            map.addInteraction(draw)
        } 
        // Feature ok
        else {
            drawResetElement.disabled = false
            // Define the string
            var string = JSON.stringify(coordinates)
            // Encode the String
            var encodedString = btoa(string)
            console.log(string)
            console.log(encodedString)
        }
    })

    // Apply greyscale filter.
    tile.on('postcompose', function(event) {
        //greyscale(event.context);
    })

}

init()

// Function to get query string parameter
function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

// function applies greyscale to every pixel in canvas
function greyscale(context) {
    var canvas = context.canvas
    var width = canvas.width
    var height = canvas.height
    var imageData = context.getImageData(0, 0, width, height)
    var data = imageData.data
    for (i=0; i<data.length; i += 4) {
        var r = data[i]
        var g = data[i + 1]
        var b = data[i + 2]
        // CIE luminance for the RGB
        var v = 0.2126 * r + 0.7152 * g + 0.0722 * b
        // Show white color instead of black color while loading new tiles:
        if(v === 0.0)
        v = 255.0
        data[i+0] = v// Red
        data[i+1] = v // Green
        data[i+2] = v // Blue
        data[i+3] = 255 // Alpha
    }
    context.putImageData(imageData,0,0)
}