//Script made from following geoJSON leaflet tutorial

//this method creates the map in accordance to the coordinates and zoom
var map = L.map('map').setView([39.7392, -104.9903], 13);

//this method allows the tile layer to be loaded and displayed to the map
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//this is a feature that stores the GeoJSON
var geojsonFeature = {
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
};

//L.geoJSON creates a GeoJSON layer
L.geoJSON(geojsonFeature).addTo(map); //addTo(map) adds the geoJSON layer to the map

var myLines = [{ //variable with a geoJSON about lines
    "type": "LineString",
    "coordinates": [[-100, 40], [-105, 45], [-110, 55]]
}, {
    "type": "LineString",
    "coordinates": [[-105, 40], [-110, 45], [-115, 55]]
}];

var myStyle = { //variable that sets the style for the lines
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
};

//L.geoJSON creates a layer for the myLines geoJSON in the 'myStyle' style
L.geoJSON(myLines, {
    style: myStyle
}).addTo(map); //.addto(map) adds this layer to the map

var states = [{ //variable with a geoJSON with state data
    "type": "Feature",
    "properties": {"party": "Republican"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-104.05, 48.99],
            [-97.22,  48.98],
            [-96.58,  45.94],
            [-104.03, 45.94],
            [-104.05, 48.99]
        ]]
    }
}, {
    "type": "Feature",
    "properties": {"party": "Democrat"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-109.05, 41.00],
            [-102.06, 40.99],
            [-102.03, 36.99],
            [-109.04, 36.99],
            [-109.05, 41.00]
        ]]
    }
}];

L.geoJSON(states, { //L.geoJSON creates the states geoJSON layer
    style: function(feature) { //style makes the formatting/style for the features in the layer
        switch (feature.properties.party) {
            case 'Republican': return {color: "#ff0000"}; //color is dependent on the case/name
            case 'Democrat':   return {color: "#0000ff"};
        }
    }
}).addTo(map); //.addTo(map) adds the layer to the map

var geojsonMarkerOptions = { //defines the styling for markers
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

L.geoJSON([someGeojsonFeature], { //a new geoJSON layer is being created
    pointToLayer: function (feature, latlng) { //pointtoLayer takes points from data to be implemented into a layer
        return L.circleMarker(latlng, geojsonMarkerOptions); //creates a circle shaped marker at a designated point
    }
}).addTo(map); //adds the point layer to the map



var geojsonFeature = { //this variable holds data for a GeoJSON feature
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
};

function onEachFeature(feature, layer) { //onEachFunction is a function that will go through each feature
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(feature.properties.popupContent); //bind popup attatches popups to features
    }
}

L.geoJSON([geojsonFeature], { //geojsonFeature is added as a layer
    onEachFeature: onEachFeature //the function will go through each feature
}).addTo(map); //this function adds it to the map

var someFeatures = [{ //this variable stores a geoJSON called some features with a filter to determine if it will be included
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "show_on_map": true
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
}, {
    "type": "Feature",
    "properties": {
        "name": "Busch Field",
        "show_on_map": false
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.98404, 39.74621]
    }
}];

L.geoJSON(someFeatures, { //the geoJSON layer is created
    filter: function(feature, layer) { //filter will go through each feature and see if the show_on_map property is true or false
        return feature.properties.show_on_map;
    }
}).addTo(map); //the layer is added to the map