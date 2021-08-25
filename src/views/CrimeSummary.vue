<template>
	<b-container class="tw-py-4 tw-flex-1 scrollbar-y">
		<h5 class="tw-mb-4 tw-text-xl tw-font-bold">Crime Summary: for radius of {{$radius / 1000}}km</h5>
		<div class="tw-grid tw-gap-1 tw-grid-cols-5 tw-mb-4">
			<button
				:key="rangeIndex"
				v-for="(range, rangeIndex) in filterRanges"
				@click="onClickFilterRange(range)"
				:class="[$filter.range === range.value ? 'tw-bg-green-600 tw-text-white' : 'tw-bg-white']"
				class="tw-border tw-rounded tw-text-sm tw-h-7 tw-border-gray-300"
			>{{range.text.replace(' Months', 'mths')}}</button>
		</div>
		<div :key="crime.id" v-for="(crime, crimeIndex) in crimeCategories">
			<div
				:style="{ backgroundColor: crime.bgColor }"
				class="tw-text-base tw-font-semibold tw-px-2 tw-py-1"
				:class="[crimeIndex === 2 ?'tw-text-black':'tw-text-white']"
			>{{ crime.category }}</div>
			<div
				class="tw-pr-4 tw-py-4 tw-border-l tw-border-r tw-border-gray-200"
				:class="{'tw-border-b' : crimeIndex === crimeCategories.length - 1 }"
			>
				<apexchart type="bar" :options="getOptions(crime.id)" :series="getSeries(crime.id)"></apexchart>
				<div
					class="px-3 tw-font-medium"
				>Total number of {{crime.category}} = {{getTotalNumber(crime.id)}}</div>
			</div>
		</div>
		<h5
			class="tw-mb-4 tw-text-lg tw-font-bold tw-bg-green-600 tw-rounded tw-text-white tw-mt-3 tw-px-3 tw-py-1"
		>Grand Total number of crimes in selected radius: {{crimesInsideRadius.length}}</h5>
	</b-container>
</template>

<script>
import crimes from '@/data.json'
import { only } from '../helpers'
import { mapActions, mapGetters } from 'vuex'
import { filterRanges } from '../consts'
export default {
	name: 'CrimeSummary',
	data: () => ({
		filterRanges
	}),
	computed: {
		...mapGetters('Map', ['$radius', '$circle']),
		...mapGetters('Records', ['$records', '$filter']),
		crimeCategories() {
			return crimes.map(
				crime => only(crime, [
					'id', 'color', 'bgColor', 'category'
				])
			)
		},
		crimesInsideRadius() {
			return this.$records.filter(rec => {
				return this.isInsideCircle(
					this.$circle.location,
					rec.latLng, this.$radius
				)
			})
		}
	},
	methods: {
		...mapActions('Records', ['setFilter']),
		onClickFilterRange(range) {
			this.setFilter({
				...this.$filter,
				range: range.value
			})
		},
		getTotalNumber(id) {
			return this.crimesInsideRadius.reduce(
				(total, c) => c.categoryId === id
					? total + 1
					: total,
				0
			)
		},
		getSeries(id) {
			return [{
				data: crimes
					.find(crime => crime.id === id).crimes
					.map(crime => {
						return this.crimesInsideRadius.reduce(
							(no, c) => c.type === crime.type ? no + 1 : no,
							0
						)
					})
			}]
		},
		getOptions(id) {
			return {
				chart: {
					type: 'bar',
					toolbar: {
						show: false,
					}
				},
				legend: {
					show: false
				},
				colors: [
					'#1D7472', '#B64330', '#DCB62D', '#51B5B3',
					'#BD6355', '#E7CA5E', '#9CAA54'
				],
				plotOptions: {
					bar: {
						borderRadius: 6,
						horizontal: true,
						distributed: true
					}
				},
				dataLabels: {
					enabled: false
				},

				xaxis: {
					labels: {
						formatter: v => Math.round(v),
					},
					categories: crimes
						.find(crime => crime.id === id).crimes
						.map(c => c.type),
				},
				yaxis: {
					min: 0,
					max: this.crimesInsideRadius.length > 4
						? this.crimesInsideRadius.length
						: 4,
					labels: {
						align: 'left',
						formatter: v => {
							return typeof v === 'number'
								? v.toFixed(0)
								: v
						},
						style: {
							fontSize: '11px'
						},
					},

				},
			}
		},
		isInsideCircle(center, { lat, lng }, radius) {
			var ky = 40000 / 360;
			var kx = Math.cos(Math.PI * lat / 180.0) * ky;
			var dx = Math.abs(lng - center.lng) * kx;
			var dy = Math.abs(lat - center.lat) * ky;
			return Math.sqrt(dx * dx + dy * dy) <= (radius / 1000);
		},
	}
}
</script>
