//* Map of income inequality per state */
//declare map var in global scope
//GOAL: Proportional symbols representing attribute values of mapped features
//STEPS:
//Step 1. Create the Leaflet map--already done in createMap()
//Step 2. Import GeoJSON data--already done in getData()
//Step 3. Add circle markers for point features to the map--already done in AJAX callback
//Step 4. Determine the attribute for scaling the proportional symbols
//Step 5. For each feature, determine its value for the selected attribute
//Step 6. Give each feature's circle marker a radius based on its attribute value
var map;
var minValue;

//Step 1. Create the Leaflet map--already done in createMap()
//function to instantiate the Leaflet map
function createMap(){
    //create the map
    map = L.map('map', {
        center: [38, -98],
        zoom: 2
    });

    //add OSM base tilelayer
    var CartoDB_Voyager = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    //call getData function
    getData();
};

function calculateMinValue(data) {
    // create empty array to store all data values
    var allValues = [];
  
    // loop through each feature
    for (var feature of data.features) {
        // loop through each year
        for (var year = 2013; year <= 2019; year++) {
            // get Gini Index value for current year
            var value = feature.properties["Gini Index " + year]; // Corrected property name
            // add value to array
            allValues.push(value);
        }
    }
  
    // get minimum value of the array
    var minValue = Math.min(...allValues);
  
    return minValue;
}

//Step 5. For each feature, determine its value for the selected attribute
//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
    //constant factor adjusts symbol sizes evenly
    var minRadius = 5;
    //Flannery Apperance Compensation formula
    var radius = 1.0083 * Math.pow(attValue/minValue, 0.5715) * minRadius;

    return radius;
}

//Step 3. Add circle markers for point features to the map--already done in AJAX callback
function createPropSymbols(data) {
   //Step 4. Determine the attribute for scaling the proportional symbols
    var attribute = "Gini Index 2019";
  
    // create a GeoJSON layer with marker options and attach popups
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
          //Step 6. Give each feature's circle marker a radius based on its attribute value
            var attValue = feature.properties[attribute];
            var radius = calcPropRadius(attValue);
            
            var geojsonMarkerOptions = {
                radius: radius,
                fillColor: "#1db8f5",
                color: "#021a24",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.3
            };

            return L.circleMarker(latlng, geojsonMarkerOptions);
        },
        onEachFeature: function (feature, layer) {
            // create popup contents
            var popupContent = "<p>Average Annual Income Inequality Estimated with the Gini Coefficient (US Census)</p>";
            if (feature.properties) {
                // loop to add feature property names and values to html string
                for (var property in feature.properties) {
                    popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
                }
                layer.bindPopup(popupContent);
            }
        }
    }).addTo(map);
}

//Step 2. Import GeoJSON data--already done in getData()
function getData(){
    //load the data
    fetch("data/IncomeInequality.geojson")
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            //calculate minimum data value
            minValue = calculateMinValue(json);
            //call function to create proportional symbols
            createPropSymbols(json);
        });
}

document.addEventListener('DOMContentLoaded', createMap);

