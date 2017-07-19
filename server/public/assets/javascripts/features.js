var init = function(selectedId = '') {

    // layerOpacity setting for all image layers
    var layerOpacity = 1, selectedBdrWidth = 10, resolution;

    // Source of features
    var targetAreasJSON = '/public/data/target-areas.json';
    var levelsJSON = '/public/data/levels.json';

    // Function used to style individual features
    var styleFunction = function(feature, resolution) {

        var target = targetAreaStates.find(x => x.id == feature.getId())

        if (target) {

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
            }

            // Alert area colours
            else if (target.state == 3) {
                strokeColour = '#f18700';
                fillColour = '#f18700';
                zIndex = 2;
            }

            // Warning removed colours
            else if (target.state == 4) {
                strokeColour = '#6f777b';
                fillColour = '#6f777b';
                zIndex = 3;				
            }

            // Generate style
            var style = new ol.style.Style({
                fill: new ol.style.Fill({ color: fillColour }),			
                stroke: new ol.style.Stroke({ color: strokeColour, width: strokeWidth, miterLimit: 2, lineJoin: 'round' }),
                zIndex: zIndex 
            });

        }

        return style;
    };

    // Style: Selected feature border
    var styleSelected = new ol.style.Style({
        stroke: new ol.style.Stroke({ color: '#ffbf47', width: selectedBdrWidth, miterLimit: 2, lineJoin: 'round' })
        //stroke: new ol.style.Stroke({ color: '#005ea5', width: selectedBdrWidth, miterLimit: 2, lineJoin: 'round' })
    });

    // Source for features
    var sourceTargetAreas = new ol.source.Vector({
        format: new ol.format.GeoJSON(),
        url: targetAreasJSON,
        defaultProjection :'EPSG:4326', 
        projection: 'EPSG:3857'
    });

    // Source for features intersecting with selected feature
    var sourceIntersect = new ol.source.Vector({
        defaultProjection :'EPSG:4326', 
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
        center: ol.proj.fromLonLat(lonLat),
        zoom: 13
    });

    // Add river levels
    var levelStyle = new ol.style.Style({
        image: new ol.style.Icon({
            src: '/public/icon-locator-blue-2x.png',
            size: [57, 71],
            anchor: [0.5, 1],
            scale: 0.5
        })
    });
    var sourceLevels = new ol.source.Vector({
        format: new ol.format.GeoJSON(),
        url: levelsJSON,
        defaultProjection :'EPSG:4326', 
        projection: 'EPSG:3857'
    });
    var levels = new ol.layer.Vector({
        source: sourceLevels,
        style: levelStyle
    });
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
        /*
        resolution = map.getView().getResolution();
        if (resolution > 19) { layerOpacity = 1 }
        else if (resolution > 9) { layerOpacity = 0.85 } 
        else if (resolution > 4) { layerOpacity = 0.7 }
        else { layerOpacity = 0.55 }	
        */
        layerOpacity = 0.7
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
    });

}

init()