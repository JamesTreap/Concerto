const locations = JSON.parse(document.getElementById('map').dataset.locations);
const southWest = L.latLng(-89.98155760646617, -180);
const northEast = L.latLng(89.99346179538875, 180);
const points = [];

const map = L.map('map', {
	minZoom: 5,
	zoomControl: false,
});

L.tileLayer(
	'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png'
).addTo(map);

locations.forEach((loc) => {
	points.push([loc.coordinates[1], loc.coordinates[0]]);
	L.marker([loc.coordinates[1], loc.coordinates[0]])
		.addTo(map)
		.bindTooltip(`<p>Day ${loc.day}:<br><b>${loc.description}</b></p>`, {
			permanent: true,
			direction: 'top',
		});
});

const dragbounds = L.latLngBounds(southWest, northEast);
const bounds = L.latLngBounds(points).pad(0.5);
map.setMaxBounds(dragbounds);
map.fitBounds(bounds);
