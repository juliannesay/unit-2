//* Map of income inequality per state */
// Declare map variable globally so all functions have access
var map;
var minValue;

// Step 1: Create the Leaflet map
function createMap() {
  // Create the map
  map = L.map('map', {
    center: [38, -98],
    zoom: 2
  });

  // Add CartoDB Voyager base tilelayer
  var CartoDB_Voyager = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(map);

  // Call getData function
  getData();
}

function calculateMinValue(data) {
  // Create empty array to store all data values
  var allValues = [];

  // Loop through each feature
  for (var feature of data.features) {
    // Loop through each year
    for (var year = 2013; year <= 2019; year++) {
      // Get Gini Index value for current year
      var value = feature.properties["Gini Index " + year]; // Corrected property name
      // Add value to array
      allValues.push(value);
    }
  }

  // Get minimum value of the array
  var minValue = Math.min(...allValues);

  return minValue;
}

// Step 5: For each feature, determine its value for the selected attribute
// Calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
  // Constant factor adjusts symbol sizes evenly
  var minRadius = 5;
  // Flannery Apperance Compensation formula
  var radius = 1.0083 * Math.pow(attValue / minValue, 0.5715) * minRadius;

  return radius;
}

// Step 3: Add circle markers for point features to the map
function pointToLayer(feature, latlng) {
  // Determine which attribute to visualize with proportional symbols
  var attribute = "Gini Index 2019";

  // Calculate the radius of each proportional symbol
  var attValue = feature.properties[attribute];
  var radius = calcPropRadius(attValue);

  // Create circle marker layer
  var geojsonMarkerOptions = {
    radius: radius,
    fillColor: "#1db8f5",
    color: "#021a24",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.3
  };

  var layer = L.circleMarker(latlng, geojsonMarkerOptions);

  // Build popup content string
  var popupContent = "<p><b>State:</b> " + feature.properties.State + "</p>";
  popupContent += "<p><b>Gini Index 2019:</b> " + feature.properties[attribute] + "</p>";
  layer.bindPopup(popupContent);

  return layer;
}

// Step 2: Import GeoJSON data
function getData() {
  // Load the data
  fetch("data/IncomeInequality.geojson")
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      // Calculate minimum data value
      minValue = calculateMinValue(json);
      // Call function to create proportional symbols
      createPropSymbols(json);
    });
}

// Step 4: Create proportional symbols
function createPropSymbols(data) {
  L.geoJson(data, {
    pointToLayer: pointToLayer
  }).addTo(map);
}

document.addEventListener('DOMContentLoaded', createMap);
