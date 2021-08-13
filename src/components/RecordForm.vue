<template>
	<b-form @submit.prevent="onSubmit" class="recform">
		<b-form-group class="recform__radio-group tw-mt-4">
			<h6 class="tw-font-semibold tw-text-base">Confidence in {{type}}</h6>
			<b-form-radio-group
				v-model="record.crimeConfidence"
				:options="crimeConfidences"
				class="tw-mt-2 tw-flex tw-space-x-3 tw-items-center"
			/>
		</b-form-group>
		<b-form-group class="recform__radio-group tw-mt-6">
			<h6 class="tw-font-semibold tw-text-base">Confidence in Location</h6>
			<b-form-radio-group
				v-model="record.locationConfidence"
				:options="locationConfidences"
				class="tw-mt-2 tw-flex tw-space-x-3 tw-items-center"
			/>
		</b-form-group>
		<b-form-group class="recform__radio-group tw-mt-6">
			<h6 class="tw-font-semibold tw-text-base">
				When did
				<span class="tw-lowercase">{{type}}</span> happen?
			</h6>
			<div class="tw-flex tw-items-center tw-space-x-3">
				<b-form-radio-group
					v-model="occuredAt"
					:options="occuredOptions"
					class="tw-flex tw-space-x-3 tw-items-center"
				/>
				<Menu v-model="occuredMenu" :closeOnContentClick="false" content-class="tw-left-0">
					<template #toggler="{on}">
						<div v-on="on" class="tw-flex tw-space-x-1 tw-items-center">
							<div
								class="tw-w-3 tw-h-3 tw-rounded-full tw-border tw-grid tw-place-items-center tw-p-px"
								:class="[occuredAtOther.startDate ? 'tw-border-blue-600' : 'tw-border-gray-500']"
							>
								<div v-if="occuredAtOther.startDate" class="tw-w-2 tw-h-2 tw-rounded-full tw-bg-blue-600"></div>
							</div>
							<span class="tw-whitespace-nowrap tw-text-sm tw-w-20 tw-leading-tight">
								{{
								occuredAtOther.startDate
								? toDateRange(occuredAtOther)
								: 'Approx Period'
								}}
							</span>
						</div>
					</template>
					<div class="tw-bg-white">
						<date-range-picker
							opens="inline"
							singleDatePicker="range"
							:ranges="false"
							:timePicker="false"
							:showWeekNumbers="false"
							@update="occuredMenu=false"
							v-model="occuredAtOther"
						/>
					</div>
				</Menu>
			</div>
		</b-form-group>
		<b-form-group class="recform__radio-group tw-mt-6">
			<h6 class="tw-font-semibold tw-text-base tw-mb-1">No of victims</h6>
			<b-form-radio-group stacked :options="noOfVictimOptions" v-model="record.noOfVictims" />
		</b-form-group>
		<b-form-group class="recform__radio-group tw-mt-6">
			<h6 class="tw-font-semibold tw-text-base tw-mb-1">Source of info</h6>
			<b-form-radio-group stacked :options="sourceOfInfos" v-model="record.sourceOfInfo" />
		</b-form-group>
		<b-form-group class="recform__radio-group tw-mt-6">
			<h6 class="tw-font-semibold tw-text-base">Do you have a web link?(URL)</h6>
			<b-form-input v-model="record.website" placeholder="Enter url here"></b-form-input>
		</b-form-group>

		<h6 class="tw-font-semibold tw-text-base tw-mt-3">Recorded By: {{$user.userId}}</h6>

		<div class="tw-space-x-3 tw-mt-4">
			<div v-if="error" class="tw-mb-3 tw-text-xs tw-text-red-500">{{error}}</div>
			<b-button type="submit" variant="primary" class="tw-w-32">Add Record</b-button>
			<b-button type="button" @click="onCancel" class="tw-w-32">Cancel</b-button>
		</div>
	</b-form>
</template>

<script>
import Menu from './utils/Menu.vue'
import DateRangePicker from 'vue2-daterange-picker'
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'
import { mapGetters } from 'vuex'
export default {
	name: 'RecordForm',
	components: { Menu, DateRangePicker },
	props: {
		type: String,
		error: String,
	},
	data: () => ({
		record: {
			crimeConfidence: 'Very High',
			locationConfidence: 'Exact Location',
			noOfVictims: "0 to 1 person",
			sourceOfInfo: "Formal (recognised media)",
			website: ''
		},
		crimeConfidences: ['Very High', 'High', 'Middle', 'Low'],
		locationConfidences: ['Exact Location', 'Nearby'],
		noOfVictimOptions: [
			'0 to 1 person', 'up to 3 people', 'up to 5 people',
			'Between 5 & 10 people', 'Between 10 & 20 people', 'More than 20 people'
		],
		sourceOfInfos: ['Formal (recognised media)', 'Informal (social media / witness)'],

		occuredMenu: false,
		occuredAt: Date.now(),
		occuredAtOther: {
			startDate: '',
			endDate: ''
		},
		occuredOptions: [{ text: 'Just now', value: Date.now() }],
	}),
	computed: {
		...mapGetters('Auth', ['$user'])
	},
	watch: {
		occuredAt(v) {
			v && (this.occuredAtOther = {
				startDate: '',
				endDate: ''
			})
		},
		occuredAtOther: {
			deep: true,
			handler(v) {
				v.startDate && (this.occuredAt = null)
			}
		},
	},
	methods: {
		onSubmit() {
			this.$emit('submit', {
				...this.record,
				occuredAt: (
					this.occuredAt
						? this.$m().format('DD/MM/YYYY hh:mm A')
						: this.toDateRange(this.occuredAtOther)
				)
			})
		},
		onCancel() {
			this.$bvModal.hide('modal-record-crime')
			this.$emit('error', '')
		},
		toDateRange(range) {
			return `${this.$m(range.startDate).format('DD/MM/YYYY')} - ${this.$m(range.endDate).format('DD/MM/YYYY')}`
		}
	}
}
</script>
<style lang="scss">
	.recform {
		&__radio-group {
			.custom-radio {
				display: flex;
				align-items: center;
				label {
					margin-left: 4px;
					font-size: 14px;
					line-height: 1.25;
				}
			}
		}
	}
</style>