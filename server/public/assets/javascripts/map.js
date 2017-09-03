
// Preset values
var defaultBoundingBox = [[-5.72,49.96],[1.77,55.81]]
var minIconResolution = 300

// Custom controls

var mapContainer = document.querySelector('.map-container')

var key = document.createElement('div')
key.classList.add('key')

var toggleSize = document.createElement('button')
toggleSize.appendChild(document.createTextNode('Full screen'))
toggleSize.setAttribute('title','Full screen')
toggleSize.classList.add('map-control','map-control-toggleSize')
mapContainer.appendChild(toggleSize)

var toggleKey = document.createElement('button')
toggleKey.appendChild(document.createTextNode('Key'))
toggleKey.setAttribute('title','Show key')
toggleKey.classList.add('map-control','map-control-toggleKey')

var keyCopy = document.createElement('div')
keyCopy.classList.add('key-copy')

var copyright = document.createElement('span')
copyright.innerHTML = '\u00A9 <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
copyright.classList.add('key-copyright')

keyCopy.appendChild(document.createTextNode('Symbols and explanations'))
keyCopy.appendChild(copyright)

key.appendChild(toggleKey)
key.appendChild(keyCopy)

mapContainer.appendChild(toggleSize)
mapContainer.appendChild(key)

// Reference require to redraw map
var map, extent

// Reference requried to redraw extent
var sourceTargetAreas

// Set default extent
extent = ol.extent.boundingExtent(defaultBoundingBox)
extent = ol.proj.transformExtent(extent, ol.proj.get('EPSG:4326'), ol.proj.get('EPSG:3857'))

var init = function() {

    var selectedId = ''

    // lon lat center
    var centre = [-1.464854,52.561928]

    // layerOpacity setting for all image layers
    var layerOpacity = 1, selectedBdrWidth = 10, resolution;

    // Source for target areas

    // JSON for features
    var targetAreasJSON = '/public/data/target-areas.json';

    // Function used to style individual features
    var styleFunction = function(feature, resolution) {

        var target = targetAreaStates.find(x => x.id == feature.getId())

        if (target) {

            if (resolution <= minIconResolution) {

                // No warning or alert colourse
                var strokeColour = 'transparent';
                var fillColour = 'transparent';
                // Stroke width used to improve display when target areas are small
                var strokeWidth = 2;
                var zIndex = 1;

                // Warning or severe warning colours
                if (target.state == 1 || target.state == 2) {
                    strokeColour = '#e3000f';
                    fillColour = '#e3000f';
                    zIndex = 3;
                    source = '/public/icon-flood-warning-small-2x.png';
                }

                // Alert area colours
                else if (target.state == 3) {
                    strokeColour = '#f18700';
                    fillColour = '#f18700';
                    zIndex = 2;
                    source = '/public/icon-flood-alert-small-2x.png';
                }

                // Warning removed colours
                else if (target.state == 4) {
                    strokeColour = '#6f777b';
                    fillColour = '#6f777b';
                    zIndex = 3;
                    source = '';
                }

                // Generate style
                var style = new ol.style.Style({
                    fill: new ol.style.Fill({ color: fillColour }),			
                    stroke: new ol.style.Stroke({ color: strokeColour, width: strokeWidth, miterLimit: 2, lineJoin: 'round' }),
                    zIndex: zIndex 
                });

            } else {

                // Icon image source
                var source = '';

                // Warning or severe warning colours
                if (target.state == 1 || target.state == 2) {
                    zIndex = 3;
                    source = '/public/icon-flood-warning-small-2x.png';
                }

                // Alert area colours
                else if (target.state == 3) {
                    zIndex = 2;
                    source = '/public/icon-flood-alert-small-2x.png';
                }

                // Warning removed colours
                else if (target.state == 4) {
                    zIndex = 3;
                    source = '';
                }

                // Generate style
                var style = new ol.style.Style({
                    image: new ol.style.Icon({
                        src: source,
                        size: [68, 68],
                        anchor: [0.5, 1],
                        scale: 0.5
                    }),
                    zIndex: zIndex 
                });

            }

        }

        return style;
    };

    // Style: Selected feature border
    var styleSelected = new ol.style.Style({
        stroke: new ol.style.Stroke({ color: '#ffbf47', width: selectedBdrWidth, miterLimit: 2, lineJoin: 'round' })
        //stroke: new ol.style.Stroke({ color: '#005ea5', width: selectedBdrWidth, miterLimit: 2, lineJoin: 'round' })
    });

    // Add target area features to source
    sourceTargetAreas = new ol.source.Vector({
        format: new ol.format.GeoJSON(),
        url: targetAreasJSON,
        projection: 'EPSG:3857'
    });

    // Source for features intersecting with selected feature
    var sourceIntersect = new ol.source.Vector({
        projection: 'EPSG:3857'
    });

    // Layer: All target areas
    var targetAreas = new ol.layer.Image({
        source: new ol.source.ImageVector({
            source: sourceTargetAreas,
            // Use custom style function to colour individual features accordingley
            style: styleFunction
        }),
        opacity: layerOpacity
    });

    // Layer: Only target areas that intersect with selected target area
    var targetAreasIntersecting = new ol.layer.Image({
        source: new ol.source.ImageVector({
            source: sourceIntersect,
            // Use custom style function to colour individual features accordingley
            style: styleFunction
        }),
        opacity: layerOpacity
    });

    // Layer: Background map
    var tile = new ol.layer.Tile({
        source: new ol.source.OSM()
    });

    // Layer: A background map clipped to selected feature multi polygon
    var tileSelected = new ol.layer.Tile();

    //  Selected feature and selected feature extent objects
    var featureSelected, featureSelectedExtent;

    // The map view object
    var view = new ol.View({
        center: ol.proj.fromLonLat(centre),
        enableRotation: false,
        zoom: 13
    });

    // Add river level features if available
    var sourceLevels = new ol.source.Vector();
    if (!isEmpty(levelsJSON)) {
        sourceLevels.addFeatures(new ol.format.GeoJSON({
            featureProjection:'EPSG:3857'
        }).readFeatures(levelsJSON))
    }

    // Add river levels layer
    var levelStyle = new ol.style.Style({
        image: new ol.style.Icon({
            src: '/public/icon-locator-blue-2x.png',
            size: [53, 71],
            anchor: [0.5, 1],
            scale: 0.5
        })
    })
    var levels = new ol.layer.Image({
        source: new ol.source.ImageVector({
            source: sourceLevels,
            style: levelStyle
        })
    })

    // Zoom reset button
    var zoomResetElement = document.createElement('button')
    zoomResetElement.appendChild(document.createTextNode('Zoom reset'))
    zoomResetElement.className = 'ol-zoom-reset'
    zoomResetElement.setAttribute('title','Reset location')
    var zoomReset = new ol.control.Control({
        element: zoomResetElement
    })

    // Render map
    map = new ol.Map({
        target: 'map-container',
        // Layer order:
        // 1. Background map
        // 2. All target areas coloured accordingley
        // 3. Selected border that straddles the selected feature then
        //    another copy of the background clipped inside the selected feature
        // 4. Only target areas that intersect with the slected feature also
        //    clipped inside the selected feature
        layers: [tile, targetAreas, tileSelected, targetAreasIntersecting, levels],
        view: view
    })

    // Add zoom reset control
    map.addControl(zoomReset)

    //
    // Map events
    //

    // Draw the outer glow (border) then
    // add a background map that is clipped to the selected feature
    tileSelected.on('precompose', function(e){
        if (featureSelected) {
            // Save initial clipping state of canvas
            e.context.save();
            // Draw the selected border
            e.vectorContext.drawFeature(featureSelected, styleSelected);
            if (resolution > 19) {
                e.vectorContext.drawFeature(featureSelected, styleFunction(featureSelected,resolution));
            }
            // Set this polygon as a clipping mask for this layers background map
            e.context.clip();
        }	
    });

    // Restore the canvas so no subsequent content is clipped/masked
    tileSelected.on('postcompose', function(e) {
        e.context.restore();
    });	

    // Clip intersect features to the shape of the selected feature
    targetAreasIntersecting.on('precompose', function(e){
        if (featureSelected) {
            // Save initial clipping state of canvas
            e.context.save();
            // Draw the selected feature with no/transparent border
            e.vectorContext.drawFeature(featureSelected, new ol.style.Style({
                stroke: new ol.style.Stroke({ color: 'transparent', width: 0, miterLimit: 2, lineJoin: 'round' })
            }));
            // Set this polygon as a clipping mask for this layers features
            e.context.clip();	
        }
    });
    
    // Restore the canvas so no subsequent content is clipped/masked
    targetAreasIntersecting.on('postcompose', function(e){
        e.context.restore();
    });

    // Update layer opacity setting for different map resolutions
    map.on('moveend', function(){

        resolution = map.getView().getResolution()

        layerOpacity = 1
        targetAreas.setZIndex(0)

        if (resolution > minIconResolution) { targetAreas.setZIndex(99) }
        else if (resolution > 19) { layerOpacity = 0.85 } 
        else if (resolution > 9) { layerOpacity = 0.7 }
        
        targetAreas.setOpacity(layerOpacity);
        targetAreasIntersecting.setOpacity(layerOpacity);
    });

    // Change pointer type and highlight style
    map.on('pointermove', function (e) {
        var pixel = map.getEventPixel(e.originalEvent);
        var hit = map.hasFeatureAtPixel(pixel);
        map.getViewport().style.cursor = hit ? 'pointer' : '';
    });

    // When main source has loaded if there is a selected feature
    // generate intersecting features source and
    // add OSM background map to tileSelected source
    // set extent to features
    sourceTargetAreas.on('change', function(e){

        // Set center or extent
        if (lonLat.length) {
            map.getView().setCenter(ol.proj.fromLonLat(lonLat))
        } else {
            map.getView().fit(extent, map.getSize());
        }

        /*
        // Set selected target area
        if (selectedId) {
            if(e.target.getState() === 'ready'){
                featureSelected = source.getFeatureById(selectedId);
                featureSelectedExtent = featureSelected.getGeometry().getExtent();
                tileSelected.setSource(new ol.source.OSM());
                sourceTargetAreas.forEachFeatureIntersectingExtent(featureSelectedExtent, function(feature) {
                    featureType = feature.getGeometry().getType();
                    if (featureType == 'MultiPolygon') {
                        sourceIntersect.addFeature(feature);
                    }
                });
                //map.getView().fit(featureSelectedExtent);
            }
        } else {
            //map.getView().fit(sourceTargetAreas.getExtent());
        }
        */
    });

    // Toggle size event
    toggleSize.addEventListener('click', function(e) {
        e.preventDefault()

        if (key.classList.contains('key-open')) {
            key.classList.remove('key-open')
        }
        mapContainer.classList.toggle('map-container-full')
        // Update extent and redraw map
        if (!lonLat.length) {
            map.getView().fit(extent, map.getSize())
        }

        map.updateSize()
    })

    // Toggle key event
    toggleKey.addEventListener('click', function(e) {
        e.preventDefault()
        key.classList.toggle('key-open')
        // Update extent and redraw map
        if (!lonLat.length) {
            map.getView().fit(extent, map.getSize())
        }
        map.updateSize()
    })

}

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}

init()