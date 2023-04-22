// Initialize the map and set its view to the United States.
var map = L.map('map').setView([37.8, -96], 4); //([37.8, -96], 4) // USA
// var map = L.map('map').setView([0, 0], 2); //([0, 0], 2) // World

// Add a tile layer to the map.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Calculate marker size viz. magnitude of earthquake.
function markerSize(magnitude) {
  return (magnitude ** 2) * 10000;
}

// Load the earthquake data and add to the map.
// d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson').then(function (data) { // Past 30 days all earthquakes
// d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson').then(function (data) { // Past 24 hours all earthquakes
// d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson').then(function (data) { // Past 7 days all earthquakes
// d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson').then(function (data) { // Past 30 days earthquakes with magnitude 4.5+
// d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson').then(function (data) { // Past 24 hours earthquakes with magnitude 4.5+
// d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson').then(function (data) { // Past 7 days earthquakes with magnitude 4.5+
d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson').then(function (data) { // Past 30 days earthquakes with magnitude 2.5+
// d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson').then(function (data) { // Past 24 hours earthquakes with magnitude 2.5+
// d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson').then(function (data) { // Past 7 days earthquakes with magnitude 2.5+
  L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
      var markerOptions = {
        radius: markerSize(feature.properties.mag),
        fillColor: depthColor(feature.geometry.coordinates[2]),
        weight: 0.5, 
        color: 'grey',
        fillOpacity: 0.8
      };
      return L.circle(latlng, markerOptions);
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup(`
      <h2>${feature.properties.place}</h2>
      <p>
      <b>Coordinates:</b> ${feature.geometry.coordinates[1]}, ${feature.geometry.coordinates[0]}
      <br>
      <b>Magnitude:</b> ${feature.properties.mag}
      <br>
      <b>Depth:</b> ${feature.geometry.coordinates[2]} km
      <br>
      <b>Date:</b> ${new Date(feature.properties.time)}
      </p>`);
    }
  }).addTo(map);
});

// Calculate legend marker color viz. depth of earthquake.
function depthColor(depth) {
  return depth > 90 ? '#800026' :
         depth > 70  ? '#BD0026' :
         depth > 50  ? '#E31A1C' :
         depth > 30  ? '#FC4E2A' :
         depth > 10   ? '#FD8D3C' :
         '#FFEDA0';
}

// Add a legend to the map.
var legend = L.control({ position: 'bottomright' });
legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'legend'),
    grades = [0, 10, 30, 50, 70, 90];

  div.innerHTML = '<h3>Depth (km)</h3>';
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      "<span id='legendMarker' style='background:" + depthColor(grades[i] + 1) + "'></span> " +
      grades[i] + 
      (grades[i + 1] ? '–' + grades[i + 1] + '<br>' : 
      '+');
  }
  return div;
};

legend.addTo(map);
