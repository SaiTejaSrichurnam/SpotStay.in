document.addEventListener("DOMContentLoaded", function () {
  const { lat, lng, title, location } = window.listingData;

  const map = L.map('map').setView([lat, lng], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a>'
  }).addTo(map);

  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(`<b>${title}</b><br>${location}`)
    .openPopup();
});
