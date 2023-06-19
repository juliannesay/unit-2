//Script from following leaflet tutorial//

//this method creates the map in accordance to the coordinates and zoom//
var map = L.map('map').setView([51.505, -0.09], 13);

//this method allows the tile layer to be loaded and displayed to the map//
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//this method creates a marker object on the map//
var marker = L.marker([51.5, -0.09]).addTo(map);

//this method creates a circle on the map according to the properties provided//
var circle = L.circle([51.508, -0.11], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(map);

//this method will create a polygon on the map with the specified properties//
var polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(map);

//bindPopup is a method that links a popup with a certain layer//
marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup(); //openPopup opens the specified popup//
circle.bindPopup("I am a circle.");
polygon.bindPopup("I am a polygon.");

//popup is a method that creates a popup that is not bound to a layer, it is just stand alone//
var popup = L.popup()
    .setLatLng([51.513, -0.09]) //this method sets the coordinates for the popup's location//
    .setContent("I am a standalone popup.") //setcontent determines the contents of this popup//
    .openOn(map); //this method opens the popup on the map//

var popup = L.popup(); //popup is made//
function onMapClick(e) { //this method specifies what will happen when the map is clicked//
    popup
        .setLatLng(e.latlng) //determines the coordinates of the click//
        .setContent("You clicked the map at " + e.latlng.toString()) //sets content for the popup, including a string and the cordinates determined by setLatLng//
        .openOn(map); //adds popup to the map//
}

map.on('click', onMapClick); //this method is a listener function that looks for clicks on the map//