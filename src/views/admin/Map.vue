<template>
	<div class="tw-h-screen tw-flex tw-flex-col tw--m-4">
		<gmap-map
			:zoom="zoom"
			ref="mapRef"
			:center="myLocation"
			:map-type-id="mapType"
			class="tw-flex-1 tw-w-full"
			:style="{
				featureType: 'poi',
				elementType: 'labels',
				stylers: [
					{ visibility: 'off' }
				]
			}"
			:options="{
				zoomControl: false,
				mapTypeControl: false,
				scaleControl: false,
				streetViewControl: false,
				rotateControl: false,
				fullscreenControl: false,
				disableDefaultUi: true
			}"
		></gmap-map>
	</div>
</template>

<script>
const initialZoom = 13
export default {
	name: 'Map',
	data: () => ({
		// STRINGS
		mapType: 'roadmap',

		// NUMBERS
		zoom: initialZoom,

		// OBJECTS
		myLocation: {
			"lat": 23.7522082,
			"lng": 90.3870041
		}
	}),
}
</script>
