
var map = L.map('map').setView([listing.Geolocation.coordinates[1],listing.Geolocation.coordinates[0]],13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a>'}).addTo(map);

L.marker([listing.Geolocation.coordinates[1],listing.Geolocation.coordinates[0]])
.addTo(map)
.bindPopup("<b><%= listing.title %></b><br><%= listing.location %>")
.openPopup();