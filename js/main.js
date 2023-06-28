//* Map of income inequality per state */

// Declare map variable globally so all functions have access
var map; // Variable to hold the Leaflet map
var minValue; // Variable to store the minimum value
var attributes; // Array to store the data attributes
var index = 0; // Index variable to track the selected attribute

// Step 1: Create the Leaflet map
function createMap() {
  // Create the map
  map = L.map('map', {
    center: [38, -98], // Set the center coordinates of the map
    zoom: 2 // Set the initial zoom level
  });

  // Add CartoDB Voyager base tilelayer
  var CartoDB_Voyager = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(map);

  // Call getData function to retrieve the data for the map
  getData();
}

function calculateMinValue(data) {
  // Create empty array to store all data values
  var allValues = [];

  // Loop through each feature
  for (var feature of data.features) {
    // Loop through each year
    for (var year = 2013; year <= 2019; year++) {
      // Get Gini Index value for the current year
      var value = feature.properties["Gini Index " + year]; // Corrected property name
      // Add value to the array
      allValues.push(value);
    }
  }

  // Get the minimum value from the array
  var minValue = Math.min(...allValues);

  return minValue;
}

// Step 5: For each feature, determine its value for the selected attribute
// Calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
  // Constant factor adjusts symbol sizes evenly
  var minRadius = 5;
  // Flannery Appearance Compensation formula to calculate the radius
  var radius = 1.0083 * Math.pow(attValue / minValue, 0.5715) * minRadius;

  return radius;
}

// Step 3: Add circle markers for point features to the map
function pointToLayer(feature, latlng) {
  // Step 4: Assign the current attribute based on the first index of the attributes array
  var attribute = attributes[index];
  // Check the selected attribute
  console.log(attribute);

  // Calculate the radius of each proportional symbol based on the attribute value
  var attValue = feature.properties[attribute];
  var radius = calcPropRadius(attValue);

  // Create circle marker layer with specified style options
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
  popupContent += "<p><b>" + attribute + ":</b> " + feature.properties[attribute] + "</p>";
  layer.bindPopup(popupContent, {
    offset: new L.Point(0, -radius)
  });

  return layer;
}

// Step 2: Import GeoJSON data
function getData() {
  // Load the data using fetch
  fetch("data/IncomeInequality.geojson")
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      // Calculate the minimum data value
      minValue = calculateMinValue(json);
      // Process the data attributes
      attributes = processData(json);
      // Call the function to create proportional symbols
      createPropSymbols(json, attributes);
      createSequenceControls();
    });
}

// Step 4: Create proportional symbols
function createPropSymbols(data, attributes) {
  L.geoJson(data, {
    pointToLayer: function (feature, latlng) {
      return pointToLayer(feature, latlng);
    }
  }).addTo(map);
}

// Step 6: Create new sequence controls
function createSequenceControls() {
  // Create range input element (slider)
  var slider = "<input class='range-slider' type='range'>";
  document.querySelector("#panel").insertAdjacentHTML('beforeend', slider);

  // Set slider attributes
  var rangeSlider = document.querySelector(".range-slider");
  rangeSlider.max = 6;
  rangeSlider.min = 0;
  rangeSlider.value = 0;
  rangeSlider.step = 1;

  // Add step buttons
  var reverseButton = "<button class='step' id='reverse'><img src='img/reverse.png'></button>";
  var forwardButton = "<button class='step' id='forward'><img src='img/forward.png'></button>";
  document.querySelector('#panel').insertAdjacentHTML('beforeend', reverseButton);
  document.querySelector('#panel').insertAdjacentHTML('beforeend', forwardButton);

  // Step 5: Add click listener for step buttons
  document.querySelectorAll('.step').forEach(function (step) {
    step.addEventListener("click", function () {
      // Get the current index value from the slider
      var index = Number(document.querySelector('.range-slider').value);

      // Update the index based on the button clicked (forward or reverse)
      if (step.id === "forward") {
        index = (index + 1) % attributes.length;
      } else {
        index = (index - 1 + attributes.length) % attributes.length;
      }

      // Update the slider value
      document.querySelector('.range-slider').value = index;
      // Update the proportional symbols
      updatePropSymbols(attributes[index]);
    });
  });

  // Step 5: Add input listener for the slider
  document.querySelector('.range-slider').addEventListener('input', function () {
    // Get the new index value from the slider
    var index = this.value;
    console.log(index);
    // Update the proportional symbols
    updatePropSymbols(attributes[index]);
  });
}

// Step 10: Resize proportional symbols according to new attribute values
function updatePropSymbols(attribute) {
  map.eachLayer(function (layer) {
    if (layer.feature && layer.feature.properties[attribute]) {
      // Access the feature properties
      var props = layer.feature.properties;

      // Update each feature's radius based on the new attribute values
      var radius = calcPropRadius(props[attribute]);
      layer.setRadius(radius);

      // Build the popup content string
      var popupContent = "<p><b>State:</b> " + props.State + "</p>";

      // Add the formatted attribute to the popup content string
      var year = attribute.split("_")[2];
      popupContent += "<p><b>" + attribute + ":</b> " + props[attribute]; "</p>";

      // Update the popup content
      popup = layer.getPopup();
      popup.setContent(popupContent).update();
    }
  });
}

// Process the data attributes
function processData(data) {
  // Empty array to hold attributes
  var attributes = [];

  // Get the properties of the first feature in the dataset
  var properties = data.features[0].properties;

  // Push each attribute name into the attributes array
  for (var attribute in properties) {
    // Only take attributes with Gini Index values
    if (attribute.indexOf("Gini Index") > -1) {
      attributes.push(attribute);
    }
  }

  // Check the resulting attributes array
  console.log(attributes);

  return attributes;
}

// Wait for the DOM to load before creating the map
document.addEventListener('DOMContentLoaded', createMap);
