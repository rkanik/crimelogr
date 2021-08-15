<template>
	<div>
		<div class="tw-flex tw-items-center tw-mb-4 tw-flex-wrap">
			<h4 class="tw-text-xl tw-flex-none">Crimes List</h4>
			<crime-filters outlined class="tw-ml-auto tw-mt-3"></crime-filters>
			<b-form-input
				v-model="search.keyword"
				placeholder="Filter crime"
				class="tw-border tw-hidden tw-mt-3 sm:tw-block tw-border-gray-400 tw-rounded tw-h-10 tw-w-48 tw-ml-auto sm:tw-ml-auto lg:tw-ml-3"
			/>
			<b-button
				variant="success"
				v-if="selection.length"
				@click="onApproveSelected"
				class="tw-h-10 tw-mt-3 tw-ml-3"
			>Approve Selected</b-button>
		</div>
		<b-form-input
			size="sm"
			v-model="search.keyword"
			placeholder="Filter crime"
			class="sm:tw-hidden tw-mb-4 tw-w-full tw-border tw-border-gray-400 tw-rounded tw-h-10 tw-ml-auto tw-mt-2"
		/>

		<div
			v-if="filter.type==='not-approved'"
			class="tw-w-1/2 tw-h-5 tw-flex tw-items-center tw-justify-end md:tw-hidden tw-mb-1 tw-space-x-2 tw-pr-3"
		>
			<div class="tw-font-bold">
				<span v-if="!selection.length">Select All</span>
				<span v-else>Deselect All</span>
			</div>
			<check-box color="#198754" :value="selection.length>0" @input="onToggleCheckAll"></check-box>
		</div>
		<b-table
			small
			show-empty
			stacked="md"
			:fields="fields"
			:per-page="perPage"
			:items="filterredCrimes"
			:current-page="currentPage"
		>
			<template #cell(category)="row">
				<span
					class="px-3 tw-py-1 tw-rounded tw-text-sm"
					:class="{
						'tw-bg-red-500 tw-text-white': row.item.categoryId === crime.violent,
						'tw-bg-orange-500 tw-text-white': row.item.categoryId === crime.rough,
						'tw-bg-yellow-500': row.item.categoryId === crime.nonViolent,
					}"
				>{{row.item.category}}</span>
			</template>
			<template #row-details="row">
				<div class="tw-grid tw-gap-2 md:tw-gap-4 tw-grid-cols-2 sm:tw-grid-cols-4 tw-py-4">
					<div>
						<div class="tw-uppercase tw-text-gray-500 tw-text-xs">Confirmed By</div>
						<div>{{row.item.confirmedBy || 'Not confirmed yet'}}</div>
					</div>
					<div>
						<div class="tw-uppercase tw-text-gray-500 tw-text-xs">Confirmed At</div>
						<div>
							{{
							row.item.confirmedAt
							?$m(row.item.confirmedAt).format('DD/MM/YYYY hh:mm A')
							:'None'
							}}
						</div>
					</div>
					<div>
						<div class="tw-uppercase tw-text-gray-500 tw-text-xs">Country</div>
						<div>{{row.item.country}}</div>
					</div>
					<div>
						<div class="tw-uppercase tw-text-gray-500 tw-text-xs">When it happended</div>
						<div>{{row.item.occuredAt}}</div>
					</div>
					<div>
						<div class="tw-uppercase tw-text-gray-500 tw-text-xs">No. of victims</div>
						<div>{{row.item.noOfVictims}}</div>
					</div>
					<div>
						<div class="tw-uppercase tw-text-gray-500 tw-text-xs">Source of Info</div>
						<div>{{row.item.sourceOfInfo}}</div>
					</div>
					<div>
						<div class="tw-uppercase tw-text-gray-500 tw-text-xs">Website Link</div>
						<div>{{row.item.website || 'None'}}</div>
					</div>
					<div>
						<div class="tw-uppercase tw-text-gray-500 tw-text-xs">Recorded At</div>
						<div>{{$m(row.item.createdAt).format('DD/MM/YYYY hh:mm A')}}</div>
					</div>
					<div class="tw-col-span-2">
						<div class="tw-uppercase tw-text-gray-500 tw-text-xs">Location Coordinates</div>
						<div>{{row.item.latLng.lat}}, {{row.item.latLng.lng}}</div>
					</div>
				</div>
			</template>
			<template #head(select)>
				<div class="tw-h-5 tw-flex tw-items-center tw-justify-center">
					<check-box color="#198754" :value="selection.length>0" @input="onToggleCheckAll"></check-box>
				</div>
			</template>
			<template #cell(select)="row">
				<div class="tw-h-8 tw-flex tw-items-center tw-justify-start md:tw-justify-center">
					<check-box
						color="#198754"
						:value="selection.includes(row.item.id)"
						@input="onToggleSelection(row.item)"
					></check-box>
				</div>
			</template>
			<template #cell(actions)="row">
				<div class="tw-flex tw-space-x-2">
					<icon-button-2
						:iconSize="14"
						class="tw-transform"
						icon="chevron-right"
						:class="{'tw-rotate-90':row.detailsShowing}"
						@click="row.toggleDetails"
					></icon-button-2>
					<Menu v-model="row.item.optionMenu" contentClass="tw-w-48 tw-right-0 tw-bg-white tw-boder">
						<template #toggler="{on}">
							<icon-button-2 v-on="on" icon="three-dots"></icon-button-2>
						</template>
						<div>
							<b-list-group>
								<b-list-group-item
									@click="toggleApprove(row.item)"
								>{{ row.item.confirmedBy ? 'Disapprove' : 'Approve'}}</b-list-group-item>
								<b-list-group-item @click="onDeleteCrime(row.item)">Delete</b-list-group-item>
							</b-list-group>
						</div>
					</Menu>
				</div>
			</template>
		</b-table>

		<div class="tw-flex tw-justify-end tw-space-x-2">
			<b-form-group
				label="Per Page"
				class="mb-0 tw-flex-none tw-flex tw-items-center tw-space-x-2 tw-border tw-px-2 tw-rounded"
				label-for="per-page-select "
			>
				<b-form-select id="per-page-select" class v-model="perPage" :options="pageOptions" size="sm"></b-form-select>
			</b-form-group>
			<b-pagination
				size="sm"
				align="fill"
				class="my-0 tw-flex-1 tw-max-w-xs"
				v-model="currentPage"
				:total-rows="totalRows"
				:per-page="perPage"
			></b-pagination>
		</div>
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import CrimeFilters from '../../components/CrimeFilters.vue'
import CheckBox from '../../components/utils/CheckBox.vue'
import IconButton2 from '../../components/utils/IconButton2.vue'
import Menu from '../../components/utils/Menu.vue'
import { _crime, } from '../../consts'
import { isObject } from '../../helpers'
export default {
	name: 'Crimes',
	components: { IconButton2, Menu, CheckBox, CrimeFilters },
	data: () => ({
		crime: _crime,
		fields: [
			{ key: 'category', label: 'Category', class: 'tw-whitespace-nowrap' },
			{ key: 'type', label: 'Type', class: 'tw-whitespace-nowrap' },
			{ key: 'points', label: 'Points' },
			{ key: 'crimeConfidence', label: 'Confidence in Crime' },
			{ key: 'locationConfidence', label: 'Confidence in Location' },
			{ key: 'recordedBy', label: 'Recorded By' },
			{ key: 'confirmedBy', label: 'Approved', formatter: v => v ? '✅' : '❌', class: 'text-center' },
			{ key: 'actions', label: 'Actions' }
		],
		perPage: 20,
		currentPage: 1,
		pageOptions: [
			5, 10, 15, 20, 50, { value: 500, text: "All" }
		],
		search: {
			keyword: ''
		},
		checkAll: false,
		selection: []
	}),
	watch: {
		'$filter.type'(type) {
			this.onChangeFilterBy(type)
		}
	},
	computed: {
		...mapGetters('Auth', ['$user']),
		...mapGetters('Users', ['$users']),
		...mapGetters('Records', ['$records', '$filter']),
		filter: {
			get() { return this.$filter },
			set(v) { this.setFilter(v) }
		},
		totalRows() {
			return this.filterredCrimes.length
		},
		filterredCrimes() {
			let records = this.$records
			if (this.filter.type === 'not-approved') {
				records = records.filter(r => !r.confirmedBy)
			}
			else if (this.filter.type !== 'all') {
				records = records.filter(rec => rec.categoryId === this.filter.type)
			}
			if (this.search.keyword.trim()) {
				let keyword = this.search.keyword.trim().toLowerCase()
				records = records.filter(record => {
					const rec = { ...record }
					delete rec.ref
					return this.findMatch(rec, keyword)
				})
			}
			return records
		}
	},
	methods: {
		...mapActions('Records', ['deleteRecord']),
		async onApproveSelected() {
			for (let id of this.selection) {
				let record = this.filterredCrimes.find(
					rec => rec.id === id
				)
				if (record) await record.ref.update({
					updatedAt: Date.now(),
					confirmedAt: Date.now(),
					confirmedBy: this.$user.userId,
				})
			}
			this.selection = []
			if (!this.filterredCrimes.length) {
				this.filter.type = 'all'
			}
		},
		onToggleCheckAll(value) {
			if (value) {
				this.selection = this.filterredCrimes.map(
					record => record.id
				)
			}
			else this.selection = []
		},
		onToggleSelection(record) {
			if (this.selection.includes(record.id)) {
				this.selection = this.selection.filter(
					id => id !== record.id
				)
			}
			else this.selection.push(record.id)
			this.checkAll = !!this.selection.length
		},
		onChangeFilterBy(by) {
			if (by === 'not-approved') {
				this.fields.unshift({
					key: 'select',
					label: 'Select'
				})
			}
			else {
				this.selection = []
				this.fields = this.fields.filter(
					field => field.key !== 'select'
				)
			}
		},
		findMatch(value, keyword) {
			if (typeof value === 'string') {
				return value.toLowerCase().includes(keyword) || value == keyword
			}
			else if (Array.isArray(value)) {
				return value.some(v => this.findMatch(v, keyword))
			}
			else if (isObject(value)) return Object.values(value).some(v => {
				return this.findMatch(v, keyword)
			})
			return value == keyword
		},
		async toggleApprove(rec) {
			await rec.ref.update({
				updatedAt: Date.now(),
				confirmedAt: rec.confirmedBy ? null : Date.now(),
				confirmedBy: rec.confirmedBy ? null : this.$user.userId,
			})
		},
		onDeleteCrime(crime) {
			if (confirm(`Are you sure to delete`)) {
				this.deleteRecord(crime)
			}
		}
	}
}
</script>