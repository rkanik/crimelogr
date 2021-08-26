<template>
	<div class="home-view tw-h-full tw-relative">
		<gmap-map
			:zoom="zoom"
			ref="mapRef"
			:center="mapCenter"
			:map-type-id="mapType"
			class="tw-h-full tw-w-full"
			@click="hideInfo"
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
		>
			<!-- Start Circle -->
			<gmap-circle
				:visible="true"
				:radius="radius"
				@click="hideInfo"
				:center="circle.location"
				:draggable="circle.draggable"
				@dragstart="onCircleDragStart"
				:options="{
					strokeColor:'#2196f3', strokeOpacity:'1',
					strokeWeight:'2', fillColor:'#2196f3', fillOpacity:'0.25',
				}"
				@drag="circle.location = latLngToNumber($event.latLng)"
			/>
			<gmap-marker
				v-if="circle.dot"
				:position="circle.location"
				:icon="require('@/assets/svg/dot.svg')"
			/>
			<!-- End Circle -->

			<!-- My Location -->
			<gmap-marker :position="myLocation" :icon="require('@/assets/svg/me-marker.svg')" />

			<!-- Record Markers -->
			<gmap-marker
				:clickable="true"
				:key="record.id"
				:position="record.latLng"
				v-for="record in mappedCrimes"
				@click="onClickRecordMarker(record)"
				:icon="record.confirmedBy
					? (record.isInside
						? require(`@/assets/svg/${record.categoryId}-marker.svg`)
						:	require(`@/assets/svg/black-marker.svg`)
					) : require(`@/assets/svg/not-confirmed.svg`)
				"
			/>
		</gmap-map>

		<search-bar
			:map="map"
			:user="$user"
			:radius="radius"
			:center="circle.location"
			@place="onSelectPlace"
		/>

		<!-- <map-types v-model="mapType" class="tw-absolute tw-right-3 tw-top-18" /> -->

		<dropdown
			:icon-button="true"
			v-model="filter.range"
			:items="filterRanges"
			class="tw-shadow tw-absolute tw-right-3 tw-top-18"
		>
			<template #toggler="{on,text}">
				<button
					v-on="on"
					id="tooltip-ranges"
					class="tw-h-20 tw-w-12 tw-py-1 tw-rounded-md tw-transition-all tw-bg-green-600 tw-text-white tw-justify-center tw-items-center tw-flex tw-flex-col"
				>
					<div class="tw-text-xl tw-font-medium">{{text.replace(' Months', '')}}</div>
					<div class="tw-text-sm tw-border-t tw-border-white tw-pt-1 tw-mt-2">mths</div>
				</button>
				<b-tooltip triggers="hover" placement="left" target="tooltip-ranges">Select a period of interest</b-tooltip>
			</template>
		</dropdown>

		<Menu v-model="radiusMenu" class="tw-absolute tw-left-3 tw-top-18">
			<template #toggler="{on}">
				<button
					v-on="on"
					id="tooltip-radius"
					class="tw-h-20 tw-w-12 tw-py-1 tw-rounded-md tw-transition-all tw-bg-green-600 tw-text-white tw-justify-center tw-items-center tw-flex tw-flex-col"
				>
					<img src="@/assets/svg/radar.svg" class="tw-w-7 tw-h-7" />
					<div
						class="tw-text-sm tw-border-t tw-border-white tw-pt-1 tw-mt-2"
					>{{radiuses.find(r => r.value === radius).text}}</div>
				</button>
				<b-tooltip
					triggers="hover"
					placement="right"
					target="tooltip-radius"
				>Select a radius of interest</b-tooltip>
			</template>
			<div class="tw-left-0 tw-w-32 tw-mt-2 tw-bg-white tw-py-1 tw-shadow-md tw-rounded-md">
				<div
					:key="rad.value"
					v-for="(rad, radIndex) in radiuses"
					class="tw-px-5 tw-py-2 tw-text-sm tw-font-medium"
					@click="onChangeRadius(rad.value)"
					:class="[
						rad.value === radius
							?'tw-text-white tw-bg-green-600'
							:'tw-bg-white tw-text-gray-600', {
							'tw-border-t tw-border-gray-200': radIndex
						}
					]"
				>{{rad.text}}</div>
			</div>
		</Menu>

		<div class="tw-absolute tw-bottom-20 tw-w-11 tw-left-3">
			<Menu v-model="psiMenu" contentClass="tw-left-full tw-bottom-full">
				<template #toggler="{on}">
					<b-tooltip
						triggers="hover"
						placement="right"
						target="tooltip-psi"
					>Calculate Person Safety Index (at 2km radius only)</b-tooltip>
					<button
						v-on="on"
						id="tooltip-psi"
						v-if="$isSubscribed"
						class="tw-h-12 tw-w-12 tw-rounded-md tw-text-white tw-shadow-md"
						:class="[$radius === 2000 ? 'tw-bg-green-600' : 'tw-bg-gray-500']"
					>
						<div class="tw-leading-snug">PSI</div>
						<div class="tw-leading-tight tw-text-sm">({{$radius / 1000}}km)</div>
					</button>
					<button
						v-else
						id="tooltip-psi"
						@click="toggleSubscribeModal(true)"
						class="tw-h-12 tw-w-12 tw-grid tw-place-items-center tw-rounded-md tw-bg-green-600 tw-text-white tw-shadow-md"
					>PSI</button>
				</template>
				<div class="tw-w-52 tw-bg-white tw-px-2 tw-py-1 tw-rounded">
					<div class="tw-bg-white tw-p-2 tw-text-sm">
						<template v-if="isNoPsi">Not enough crime data in selected area</template>
						<template v-else>
							<div :key="i" v-for="(p,i) in psi">
								{{p.category}}:
								<span class="tw-font-medium">{{p.psi}}</span>
							</div>
						</template>
					</div>
				</div>
			</Menu>
			<icon-button
				icon="arrows-move"
				id="tooltip-move-circle"
				class="tw-mt-2 tw-text-white"
				@click="toggleCircleDraggable"
				:class="[circle.draggable ? 'tw-bg-green-600' : 'tw-bg-gray-500']"
			></icon-button>
			<b-tooltip
				triggers="hover"
				placement="right"
				target="tooltip-move-circle"
			>Activate this button to move circle</b-tooltip>

			<icon-button
				id="tooltip-current-location"
				class="tw-mt-2 tw-bg-green-600 tw-text-white"
				@click="onClickCurrentLocation"
			>
				<svg viewBox="0 0 91 91" class="tw-h-11 tw-w-11">
					<g>
						<path
							d="M35.297,39.05v8.302h3.4V39.05c0-3.646,2.965-6.612,6.611-6.612h3.654c3.648,0,6.615,2.966,6.615,6.612   v8.302h3.4V39.05c0-4.066-2.441-7.568-5.934-9.135c1.422-1.477,2.303-3.479,2.303-5.688c0-4.527-3.684-8.211-8.211-8.211   s-8.211,3.684-8.211,8.211c0,2.208,0.881,4.211,2.303,5.688C37.738,31.481,35.297,34.982,35.297,39.05z M47.137,19.417   c2.652,0,4.811,2.158,4.811,4.811s-2.158,4.81-4.811,4.81s-4.811-2.157-4.811-4.81S44.484,19.417,47.137,19.417z"
							fill="white"
						/>
						<path
							d="M54.313,49.808v-9.953h-3.4v21.069c0,0.563-0.475,1.037-1.039,1.037c-0.561,0-1.035-0.475-1.035-1.037   V49.597h-3.4v11.327c0,0.563-0.475,1.037-1.037,1.037s-1.037-0.475-1.037-1.037V39.854h-3.4v9.953   c-9.076,1.442-15.32,5.418-16.414,10.374h-2.723v3.4h2.781c1.568,5.815,10.488,10.218,21.83,10.62v3.639h3.4v-3.639   c11.34-0.402,20.26-4.805,21.828-10.62h3.025v-3.4h-2.967C69.631,55.226,63.389,51.25,54.313,49.808z M48.838,70.794v-1.787h-3.4   v1.787c-9.439-0.364-16.328-3.699-18.172-7.212h5.594v-3.4h-5.762c1.303-3.051,6.299-5.753,12.865-6.915v7.657   c0,2.446,1.99,4.438,4.438,4.438c1.037,0,1.98-0.373,2.736-0.972c0.756,0.599,1.699,0.972,2.736,0.972   c2.449,0,4.439-1.991,4.439-4.438v-7.657c6.564,1.162,11.563,3.864,12.863,6.915h-5.52v3.4h5.352   C65.166,67.095,58.275,70.43,48.838,70.794z"
							fill="white"
						/>
					</g>
				</svg>
			</icon-button>
			<b-tooltip
				triggers="hover"
				placement="right"
				target="tooltip-current-location"
			>Click this to centre circle on your location</b-tooltip>
		</div>

		<div class="tw-absolute tw-bottom-20 tw-w-11 tw-right-3">
			<div class="tw-w-11 tw-rounded-md tw-overflow-hidden tw-shadow-md tw-mt-2">
				<icon-button icon="dash" @click="zoom > 1 && (zoom -= 1)" class="tw-bg-green-600 tw-text-white"></icon-button>
				<icon-button
					icon="plus"
					@click="zoom < 24 && (zoom += 1)"
					class="tw-mt-2 tw-bg-green-600 tw-text-white"
				></icon-button>
			</div>
		</div>

		<div class="tw-absolute tw-inset-x-3 tw-bottom-5 tw-flex tw-justify-center tw-space-x-3">
			<button
				v-b-modal.modal-record-crime
				class="tw-flex-none tw-flex tw-items-center tw-justify-center tw-h-11 tw-rounded-md tw-transition-all tw-bg-red-500 tw-text-white tw-space-x-1 tw-pl-2 tw-pr-4 tw-text-sm"
			>
				<svg height="24" width="24" class="tw-transform tw-scale-75">
					<path d="M0 0h24v24H0V0z" fill="none" />
					<path
						fill="currentColor"
						d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"
					/>
				</svg>
				<span class="tw-leading-tight">
					Record
					<br />Crime
				</span>
			</button>
			<div
				class="tw-text-sm tw-bg-green-600 tw-flex tw-items-center tw-whitespace-nowrap tw-text-white tw-px-3 tw-rounded"
			>Total crime points in radius = {{pointsInsideCircle}}</div>
		</div>

		<CreateRecordDialog :createRecord="onCreateRecord" />
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import SearchBar from '@/components/SearchBar'
import CreateRecordDialog from '@/components/CreateRecordDialog'
// import MapTypes from '../components/MapTypes.vue'
import Menu from '../components/utils/Menu.vue'
import { only } from '../helpers'
import { countries, filterRanges, _time } from '../consts'
import crimes from '@/data.json'
import IconButton from '../components/utils/IconButton.vue'
import Dropdown from '../components/utils/Dropdown.vue'

const initialZoom = 14
const iLatLng = () => ({ lat: 0, lng: 0 })

export default {
	name: 'Home',
	components: {
		Menu,
		SearchBar,
		CreateRecordDialog,
		// MapTypes,
		IconButton,
		Dropdown
	},
	data: () => ({
		filterRanges,

		// NULLS
		map: null,

		infoWindow: null,
		currentMarker: null,
		myLocationInterval: null,

		// BOOLEANS
		radiusMenu: false,
		psiMenu: false,

		// STRINGS
		mapType: 'roadmap',

		// NUMBERS
		zoom: initialZoom,

		// ARRAYS
		markers: [],
		nearbyPlaces: [],
		radiuses: [
			{ value: 100, text: '100 M' },
			{ value: 200, text: '200 M' },
			{ value: 300, text: '300 M' },
			{ value: 500, text: '500 M' },
			{ value: 1000, text: '1 KM' },
			{ value: 2000, text: '2 KM' },
			{ value: 3000, text: '3 KM' },
			{ value: 5000, text: '5 KM' },
			{ value: 8000, text: '8 KM' },
			{ value: 10000, text: '10 KM' },
		],

		// OBJECTS
		myLocation: iLatLng(),
		mapCenter: iLatLng(),
		dialogs: {
			search: false
		},
	}),
	created() {
		this.updateMyLocation({
			updateCircle: !this.circle.location.lat
		})
		this.myLocationInterval = setInterval(() => {
			this.updateMyLocation()
		}, 2000);
	},
	beforeDestroy() {
		clearInterval(this.myLocationInterval)
		window.history.replaceState({}, document.title, location.pathname);
	},
	mounted() {
		this.$refs.mapRef.$mapPromise.then(map => {
			this.map = map
			this.setMapBoundsAndCenter(this.$user.country)
			this.infoWindow = new window.google.maps.InfoWindow();

			if (this.$route.query.center) {
				let [lat, lng] = this.$route.query.center.split(',')
				if (!lat || !lng) return
				this.onSelectPlace({ lat: +lat, lng: +lng })
			}
		})
	},
	watch: {
		'$user.country'(country) {
			if (!this.map) return
			this.setMapBoundsAndCenter(country)
		}
	},
	computed: {
		...mapGetters(['$gpsCountry']),
		...mapGetters('Auth', ['$user', '$isSubscribed']),
		...mapGetters('Records', ['$records', '$filter']),
		...mapGetters('Map', ['$radius', '$circle']),
		filter: {
			get() { return this.$filter },
			set(v) { this.setFilter(v) }
		},
		radius: {
			get() { return this.$radius },
			set(v) { this.setRadius(v) }
		},
		circle: {
			get() { return this.$circle },
			set(v) { this.setCircle(v) }
		},
		isAdmin() {
			return ['admin', 'super-admin'].includes(this.$user.role)
		},
		psi() {
			if (this.radius !== 2000) return null
			let cats = this.insideCrimes
				.filter(crm => (+crm.createdAt + _time.month) > Date.now())
				.reduce((cats, crm) => {
					cats[crm.categoryId] += crm.points
					return cats
				}, { 1: 0, 2: 0, 3: 0 })

			cats = Object.entries(cats).map(([id, count]) => {
				let crime = crimes.find(c => c.id == id)
				return {
					category: `PSI-${crime.category[0].toUpperCase()} (${crime.category.split(' ')[0]})`,
					psi: (count / this.getTotalPointsOf(id)).toFixed(2)
				}
			})

			return cats
		},
		isNoPsi() {
			if (!this.psi) return true
			return this.psi.reduce(
				(total, category) => total + +category.psi, 0
			) === 0
		},
		pointsInsideCircle() {
			return this.insideCrimes
				.reduce((total, rec) => total + rec.points, 0)
		},
		insideCrimes() {
			return this.mappedCrimes
				.filter(crime => crime.isInside)
		},
		mappedCrimes() {
			return this.$records.map(rec => ({
				...rec, isInside: this.isInsideCircle(
					this.circle.location,
					rec.latLng, this.radius
				)
			}))
		},

	},
	methods: {
		...mapActions(['toggleSubscribeModal']),
		...mapActions('Map', [
			'setCircle',
			'setRadius',
			'resetRadius',
		]),
		...mapActions('Records', [
			'createRecord',
			'deleteRecord',
			'updateCrime'
		]),
		async onCreateRecord(record) {
			let res = await this.createRecord({
				...record,
				country: this.$user.country,
				recordedBy: this.$user.userId,
				latLng: this.circle.location,
				possibleDuplication: false,
				confirmedAt: this.isAdmin ? Date.now() : null,
				confirmedBy: this.isAdmin ? this.$user.userId : null,
				createdAt: Date.now(),
				updatedAt: Date.now(),
			})
			return res
		},
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
			if (country.code !== this.$gpsCountry) {
				this.circle.location = country.center
			}
		},
		onChangeRadius(value) {
			if (!this.$isSubscribed && value > 2000) {
				return this.toggleSubscribeModal(true)
			}
			this.radius = value
		},
		toggleCircleDraggable() {
			this.circle = {
				...this.circle,
				draggable: !this.circle.draggable
			}
		},
		onCircleDragStart() {
			this.hideInfo()
			this.circle = {
				...this.circle,
				dot: true
			}
		},
		getTotalPointsOf(categoryId) {
			return crimes
				.find(cat => cat.id == categoryId).crimes
				.reduce((total, crime) => total + crime.points, 0)
		},
		hideInfo() {
			this.infoWindow.close()
			this.radiusMenu = false
			this.psiMenu = false
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
		isInsideCircle(center, { lat, lng }, radius) {
			var ky = 40000 / 360;
			var kx = Math.cos(Math.PI * lat / 180.0) * ky;
			var dx = Math.abs(lng - center.lng) * kx;
			var dy = Math.abs(lat - center.lat) * ky;
			return Math.sqrt(dx * dx + dy * dy) <= (radius / 1000);
		},
		latLngToNumber({ lat, lng }) {
			if (typeof lat !== 'function') return { lat, lng }
			return { lat: lat(), lng: lng() }
		},
		onSelectPlace(e) {
			const latLng = this.latLngToNumber(e)

			this.zoom = initialZoom
			this.map.setZoom(this.zoom)

			this.map.panTo(latLng);

			this.resetRadius()

			this.circle = {
				...this.circle, dot: true,
				location: { ...latLng }
			}
			this.mapCenter = { ...latLng }
			this.hideInfo()
		},
		onClickCurrentLocation() {
			this.zoom = initialZoom

			this.map.panTo(this.myLocation);
			this.map.setZoom(initialZoom)

			this.resetRadius()

			this.mapCenter = { ...this.myLocation }
			this.circle = {
				...this.circle, dot: false,
				location: { ...this.myLocation }
			}

		},
		updateMyLocation({ updateCircle = false } = {}) {
			navigator.geolocation.getCurrentPosition(position => {
				let country = countries.find(country => {
					return country.value === this.$user.country
				})
				if (country !== this.$gpsCountry) {
					this.myLocation = country.center
				}
				else this.myLocation = {
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				}
				!this.mapCenter.lat && (this.mapCenter = { ...this.circle.location })
				if (updateCircle) {
					this.circle = {
						...this.circle,
						location: this.myLocation
					}
				}
			})
		},
		createRecordInfoWindow(rec) {
			const div = document.createElement('div')

			let btn, notConfirmed
			const canDelete = this.isAdmin || this.$user.userId === rec.recordedBy
			if (canDelete) {
				// Delete button
				btn = document.createElement('button')
				btn.innerText = 'Delete'
				btn.style.cssText = `padding: 2px 8px`
				btn.classList.add('btn', 'btn-danger', 'btn-sm', 'm-1')
				btn.addEventListener('click', async () => {
					await this.deleteRecord(only(rec, ['id', 'ref']))
					this.hideInfo()
				})
			}
			if (this.$user.userId === rec.recordedBy && !rec.confirmedBy) {
				notConfirmed = `
					<div class='tw-text-sm tw-text-red-500 tw-ml-3 tw-mb-0 tw-leading-9'>Not confirmed yet</div>
				`
			}

			// Wrapper
			const wrapper = document.createElement('div')
			wrapper.classList.add('mt-2', 'tw-flex', 'tw-space-x-2')

			if (this.isAdmin && !rec.confirmedBy) {
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

			canDelete && wrapper.appendChild(btn)

			if (rec.isInside) div.innerHTML = `
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
			else div.innerHTML = `
				${!rec.confirmedBy ? "<div class='tw-text-sm tw-text-red-500 tw-mb-0'>Not confirmed yet</div>" : ""}
				<div>Please drag circle here or increase its radius to ${this.isAdmin ? "view and review" : "view"} this particular crime record</div>
			`
			notConfirmed && (div.innerHTML += notConfirmed)
			if (rec.isInside && (this.isAdmin || canDelete)) div.appendChild(wrapper)

			return div
		}
	}
}
</script>