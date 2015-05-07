var $ = require('jquery');
var map, jsonView;

function _ensureMap(){
	var $mapContainer = $('.map-container');
	$mapContainer.show();
	if (map) return map;

	var southWest = L.latLng(-16.5467, 23.8898),
		northEast = L.latLng(-12.5653, 29.4708),
		bounds = L.latLngBounds(southWest, northEast);

	var map = L.map('map',{
		maxBounds: bounds,
	}).setView([-13.4484, 28.072], 10);

	
	L.tileLayer('img/MapQuest/{z}/{x}/{y}.jpg', {
	//L.tileLayer('http://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png', {
		id: 'examples.map-i875mjb7',
		maxZoom: 14,
		minZoom: 8,
	}).addTo(map);

	$('.js-close-map').click(function(){
		$mapContainer.hide();
	});
}

function _showGeoJSON(geojson){
	_ensureMap();

	if (jsonView){
		// clear json view
	}

	// load the json here
	//
	
}

module.exports = _showGeoJSON;
