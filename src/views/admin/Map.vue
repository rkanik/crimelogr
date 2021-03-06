<template>
	<div class="tw-relative tw-h-full tw-flex tw-flex-col tw--m-4">
		<gmap-map
			ref="mapRef"
			:zoom="zoom"
			:center="mapCenter"
			:map-type-id="mapType"
			@click="onClickMap"
			:style="{
				featureType: 'poi',
				elementType: 'labels',
				stylers: [{ visibility: 'off' }]
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
			class="tw-flex-1 tw-w-full tw--mb-8"
		>
			<!-- Record Markers -->
			<gmap-marker
				:clickable="true"
				:key="record.id"
				:position="record.latLng"
				v-for="record in filterRecords"
				@click="onClickRecordMarker(record)"
				:icon="record.confirmedBy
					? require(`@/assets/svg/${record.categoryId}-marker.svg`)
					: require(`@/assets/svg/not-confirmed.svg`)
				"
			/>
		</gmap-map>
		<crime-filters
			toggler-class="tw-bg-green-600 tw-text-white"
			class="tw-absolute tw-top-4 tw-right-4"
		></crime-filters>
	</div>
</template>

<script>
import { only } from '../../helpers'
import { mapActions, mapGetters } from 'vuex'

import CrimeFilters from '../../components/CrimeFilters.vue'
import { countries } from '../../consts'

const initialZoom = 3

export default {
	name: 'Map',
	components: { CrimeFilters },
	data: () => ({
		// NULLS
		map: null,
		infoWindow: null,

		// STRINGS
		mapType: 'roadmap',

		// NUMBERS
		zoom: initialZoom,

		// OBJECTS
		mapCenter: {
			lat: 7.6364427,
			lng: -1.9057581
		},

	}),
	mounted() {
		this.$refs.mapRef.$mapPromise.then(map => {
			this.map = map

			if (this.$filter.country !== 'all') {
				this.setMapBoundsAndCenter(this.$filter.country)
			}
			this.infoWindow = new window.google.maps.InfoWindow();

			if (this.$route.query.center) {
				let [lat, lng] = this.$route.query.center.split(',')
				if (!lat || !lng) return
				this.onSelectPlace({ lat: +lat, lng: +lng })
			}
		})
	},
	watch: {
		'$filter.country'(country) {
			if (!this.map) return
			if (country === 'all') {
				this.map.setRestriction(null)
				this.zoom = initialZoom
			}
			else this.setMapBoundsAndCenter(country)
		}
	},
	computed: {
		...mapGetters('Auth', ['$user', '$isUser', '$isViewer']),
		...mapGetters('Records', ['$records', '$filter']),
		filter: {
			get() { return this.$filter },
			set(v) { this.setFilter(v) }
		},
		filterRecords() {
			if (!this.$isViewer) return this.$records
			return this.$records//.filter(record => record.confirmedBy)
		}
	},
	methods: {
		...mapActions('Records', ['setFilter', 'deleteRecord']),
		setMapBoundsAndCenter(filterCountry) {
			let country = countries.find(country => {
				return country.value === filterCountry
			})
			this.map.setRestriction({
				latLngBounds: country.bound,
				strictBounds: false,
			})
			this.zoom = initialZoom
			this.mapCenter = country.center
		},
		onClickMap() {
			this.infoWindow.close()
		},
		onClickRecordMarker(record) {
			this.infoWindow.setContent(
				this.createRecordInfoWindow(record)
			);
			this.infoWindow.setPosition(record.latLng);
			this.infoWindow.setOptions({
				pixelOffset: new window.google.maps.Size(0, -28)
			});
			this.infoWindow.open(this.map);
		},
		createRecordInfoWindow(rec) {
			const div = document.createElement('div')

			let btn, notConfirmed

			// Delete button
			btn = document.createElement('button')
			btn.innerText = 'Delete'
			btn.style.cssText = `padding: 2px 8px`
			btn.classList.add('btn', 'btn-danger', 'btn-sm', 'm-1')
			btn.addEventListener('click', async () => {
				await this.deleteRecord(only(rec, ['id', 'ref']))
				this.infoWindow.close()
			})

			// Wrapper
			const wrapper = document.createElement('div')
			wrapper.classList.add('mt-2', 'tw-flex', 'tw-space-x-2')

			if (!rec.confirmedBy) {
				if (!this.$isViewer) {
					// Approve button
					const approveButton = document.createElement('button')
					approveButton.innerText = 'Approve'
					approveButton.style.cssText = `padding: 2px 8px`
					approveButton.classList.add('btn', 'btn-primary', 'btn-sm', 'm-1')
					approveButton.addEventListener('click', async () => {
						const update = {
							updatedAt: Date.now(),
							confirmedAt: Date.now(),
							confirmedBy: this.$user.userId,
						}
						await rec.ref.update(update)
						this.onClickRecordMarker({ ...rec, ...update })
					})
					wrapper.appendChild(approveButton)
				}

				this.$isUser && (notConfirmed = `
					<div class='tw-text-sm tw-text-red-500 tw-mb-0 tw-leading-9'>Not confirmed yet</div>
				`)
			}

			!this.$isViewer && wrapper.appendChild(btn)


			div.innerHTML = `
				<div>Category: <strong>${rec.category}</strong></div>
				<div>Type: <strong>${rec.type}</strong></div>
				<div>Crime Points: <strong>${rec.points}</strong></div>
				<div>Confidence in Crime: <strong>${rec.crimeConfidence}</strong></div>
				<div>Confidence in Location: <strong>${rec.locationConfidence}</strong></div>
				<div>When it happended: <strong>${rec.occuredAt}</strong></div>
				<div>No. of Victims: <strong>${rec.noOfVictims}</strong></div>
				<div>Source of Info: <strong>${rec.sourceOfInfo}</strong></div>
				<div>Web Link: <strong>${rec.website}</strong></div>
				${this.isAdmin ? `<div>Recorded By: <strong>${rec.recordedBy}</strong></div>` : ''}
			`
			notConfirmed && (div.innerHTML += notConfirmed)
			div.appendChild(wrapper)
			return div
		}
	}
}
</script>
