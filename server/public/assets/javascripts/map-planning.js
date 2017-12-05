// Setup fullscreen container and key (legend) elements

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

keyCopy.innerHTML = '<h2 class="bold-medium">Key</h2>'
keyCopy.appendChild(copyright)

key.appendChild(keyToggle)
key.appendChild(keyCopy)

mapContainerInner.appendChild(key)

// Add inner comtainer
mapContainer.appendChild(mapContainerInner)

// Global variables
var url, lonLat, zoom, path, geoJson

// Codec used for compression
var codec

// Reference required to redraw map
var map, vector

var init = function() {

    // Default values
    url = [location.protocol, '//', location.host, location.pathname].join('')
    lonLat = getParameterByName('lonLat') || ''
    zoom = getParameterByName('zoom') || 15
    path = getParameterByName('path') || ''
    geoJson = { }

    // Set up compression codec
    codec = JsonUrl('lzma')

    // Drawing styles for different polygon editing states
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
    var styleDrawComplete = new ol.style.Style({
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
    var styleDrawCompleteGeometry = new ol.style.Style({
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

    // Source: vector layer
    var source = new ol.source.Vector()

    // Feature: boundary
    var feature = new ol.Feature({
        name: 'Boundary'
    })
    feature.on('change', function(e) {
        feature = e.target
    })
    source.addFeature(feature)

    // Layer: Background map
    var tile = new ol.layer.Tile({
        source: new ol.source.OSM()
    })

    // Layer: vector
    vector = new ol.layer.Vector({
        source: source,
        style: [styleDrawComplete, styleDrawCompleteGeometry]
    })

    // The map view object
    var view = new ol.View({
        center: ol.proj.fromLonLat(centre),
        enableRotation: false,
        zoom: zoom
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
        // Finish drawing on escape key
        document.addEventListener('keyup', function() {
            if (event.keyCode === 27) {
                draw.finishDrawing()
            }
        })
        this.disabled = true
    })
    var drawStart = new ol.control.Control({
        element: drawStartElement
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
        vector.getSource().getFeatures()[0].setGeometry(null)
        // Update url
        updateUrl(feature)
    })
    var drawReset = new ol.control.Control({
        element: drawResetElement
    })

    // Setup interactions

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
        features: source.getFeatures(),
        type: 'Polygon',
        style: styleDraw
    })
    var snap = new ol.interaction.Snap({
        source: source
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

    // Deactivate draw interaction after first polygon is finished
    draw.on('drawend', function (e) {
        var coordinates = e.feature.getGeometry().getCoordinates()[0]
        // Polygon is too small start again
        if (coordinates.length < 4) {
            drawStartElement.disabled = false
            e.feature.setGeometry(null)
        } 
        // Polygon is ok
        else {
            drawResetElement.disabled = false
            updateUrl(e.feature)
            map.removeInteraction(this)
        }
    })

    // Update url when feature has been modified
    modify.on('modifyend',function(e){
        updateUrl(feature)
    })

    // Add feature from path
    if (path) {
        codec.decompress(path).then(result => {
            // Check for valid geoJson
            feature = new ol.format.GeoJSON().readFeature(result)
            vector.getSource().getFeatures()[0].setGeometry(feature.getGeometry())
            map.addInteraction(snap)
            map.addInteraction(modify)
            drawStartElement.disabled = true
            drawResetElement.disabled = false
        })
    }

    // Apply greyscale filter.
    tile.on('postcompose', function(event) {
        //greyscale(event.context);
    })

    // Popstate event
    window.onpopstate = function(e) {

        // Set path to previous value
        path = getParameterByName('path') || ''

        // Add geometry if path exists
        if (path) {
            codec.decompress(path).then(result => {
                // Get geometry from previous path
                feature = new ol.format.GeoJSON().readFeature(result)
                // Replace current geomtry with previous
                vector.getSource().getFeatures()[0].setGeometry(feature.getGeometry())
                map.addInteraction(snap)
                map.addInteraction(modify)
                drawStartElement.disabled = true
                drawResetElement.disabled = false
            })
        }

        // Clear geometry if previous url had no path
        else {
            vector.getSource().getFeatures()[0].setGeometry(null)
            map.removeInteraction(draw)
            map.removeInteraction(snap)
            map.removeInteraction(modify)
            drawStartElement.disabled = false
            drawResetElement.disabled = true
        }
        
    }

}

init()

// Function to get query string parameter
function getParameterByName(name) {
    var v = window.location.search.match(new RegExp('(?:[\?\&]'+name+'=)([^&]+)'))
    return v ? v[1] : null
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

// Update url
function updateUrl(feature) {

    // Set current map centre and reduce decimal places
    var centreLonLat = ol.proj.transform(map.getView().getCenter(), 'EPSG:3857', 'EPSG:4326')
    centreLonLat[0] = centreLonLat[0].toFixed(6)
    centreLonLat[1] = centreLonLat[1].toFixed(6)
    document.getElementById('lonLat').value = centreLonLat

    // Set current zoom level
    zoom = map.getView().getZoom().toFixed(2)
    document.getElementById('zoom').value = zoom

    // We have a new or modified feature
    if (feature.getGeometry()) {
        // Write feature as GeoJson
        var writer = new ol.format.GeoJSON()
        geoJson = writer.writeFeature(feature,{
            featureProjection : 'EPSG:4326',
            decimals : 6 // This should reduce size of data and still gives +- 4inch precision
        })
        // Compress the String and update the url
        codec.compress(geoJson).then(result => {
            path = result
            document.getElementById('path').value = path
            // Add or update path in url
            history.pushState(null, null, url + '?lonLat=' + centreLonLat + '&zoom=' + zoom + '&path=' + path)
        })
    }
    
    // We don't have a feature
    else {
 
        // Clear the path value
        document.getElementById('path').value = ''
 
        // Remove path from url
        history.pushState(null, null, url + '?lonLat=' + centreLonLat + '&zoom=' + zoom)
    }

}