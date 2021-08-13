<template>
	<div>
		<div class="tw-flex tw-items-center tw-mb-4 tw-flex-wrap">
			<h4 class="tw-text-xl tw-flex-none">Crimes List</h4>
			<b-form-select
				size="sm"
				v-model="filterBy"
				:options="filterOptions"
				class="tw-border tw-ml-auto tw-rounded tw-px-4 tw-py-1"
			></b-form-select>
			<b-form-input
				size="sm"
				v-model="search.keyword"
				placeholder="Seach here"
				class="tw-border tw-rounded tw-w-48 tw-ml-auto tw-mt-2 sm:tw-mt-0 sm:tw-ml-2"
			/>
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
						'tw-bg-red-500 tw-text-white': row.item.crime.id === crime.violent,
						'tw-bg-orange-500 tw-text-white': row.item.crime.id === crime.rough,
						'tw-bg-yellow-500': row.item.crime.id === crime.nonViolent,
					}"
				>{{row.item.crime.category}}</span>
			</template>
			<template #row-details="row">
				<div class="tw-grid tw-gap-2 md:tw-gap-4 tw-grid-cols-2 sm:tw-grid-cols-4 tw-py-4">
					<div>
						<div class="tw-uppercase tw-text-gray-500 tw-text-xs">Confirmed By</div>
						<div>{{row.item.confirmedBy}}</div>
					</div>
					<div>
						<div class="tw-uppercase tw-text-gray-500 tw-text-xs">Confirmed At</div>
						<div>{{$m(row.item.confirmedAt).format('DD/MM/YYYY hh:mm A')}}</div>
					</div>
					<div>
						<div class="tw-uppercase tw-text-gray-500 tw-text-xs">Location Coordinates</div>
						<div>{{row.item.latLng.lat}}, {{row.item.latLng.lng}}</div>
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
						<div>{{row.item.website}}</div>
					</div>
					<div>
						<div class="tw-uppercase tw-text-gray-500 tw-text-xs">Recorded At</div>
						<div>{{$m(row.item.createdAt).format('DD/MM/YYYY hh:mm A')}}</div>
					</div>
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
					<Menu v-model="row.item.menu" contentClass="tw-w-48 tw-right-0 tw-bg-white tw-boder">
						<template #toggler="{on}">
							<icon-button-2 v-on="on" icon="three-dots"></icon-button-2>
						</template>
						<div>
							<b-list-group>
								<b-list-group-item
									@click="toggleApprove(row.item)"
								>{{ row.item.confirmedBy ? 'Disapprove' : 'Approve'}}</b-list-group-item>
								<b-list-group-item @click="onDeleteCrime">Delete</b-list-group-item>
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

		<!-- <div class="tw-space-y-3 tw-mt-3">
			<div :key="rec.id" v-for="rec in filterredCrimes">
				<div
					class="tw-p-4 tw-border tw-border-gray-300 tw-rounded tw-space-y-1"
					:class="{
						'tw-bg-red-100': rec.crime.id === crime.violent,
						'tw-bg-orange-100': rec.crime.id === crime.rough,
						'tw-bg-yellow-100': rec.crime.id === crime.nonViolent,
					}"
				>
					<div class="tw-flex tw-justify-between">
						<span>Category</span>
						<span
							class="px-3 tw-rounded tw-text-sm"
							:class="{
								'tw-bg-red-500 tw-text-white': rec.crime.id === crime.violent,
								'tw-bg-orange-500 tw-text-white': rec.crime.id === crime.rough,
								'tw-bg-yellow-500': rec.crime.id === crime.nonViolent,
							}"
						>{{rec.crime.category}}</span>
					</div>
					<div class="tw-flex tw-justify-between">
						<span>Crime type</span>
						<span>{{rec.crime.type}}</span>
					</div>
					<div class="tw-flex tw-justify-between">
						<span>Crime points</span>
						<span>{{rec.crime.points}}</span>
					</div>
					<div class="tw-flex tw-justify-between">
						<span>Confidence in this crime event</span>
						<span class="tw-capitalize">{{rec.crimeConfidence}}</span>
					</div>
					<div class="tw-flex tw-justify-between">
						<span>Confidence in crime location</span>
						<span class="tw-capitalize">{{rec.locationConfidence}}</span>
					</div>
					<div class="tw-flex tw-justify-between">
						<span>When did this crime happen?</span>
						<span>{{new Date(rec.createdAt).toLocaleString()}}</span>
					</div>
					<div class="tw-flex tw-justify-between">
						<span>Website link</span>
						<span>{{rec.website}}</span>
					</div>
					<div class="tw-flex tw-justify-between">
						<span>Approved</span>
						<span>{{rec.confirmedBy ? 'Yes' : 'No'}}</span>
					</div>
					<div v-if="!rec.confirmedBy">
						<div class="tw-mt-3">
							<b-button size="sm" @click="approve(rec)">Approve</b-button>
						</div>
					</div>
				</div>
			</div>
		</div>-->
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import IconButton2 from '../../components/utils/IconButton2.vue'
import Menu from '../../components/utils/Menu.vue'
import { _crime } from '../../consts'
import { isObject } from '../../helpers'
export default {
	components: { IconButton2, Menu },
	name: 'Crimes',
	data: () => ({
		crime: _crime,
		filterBy: 'all',
		filterOptions: [
			{ value: 'all', text: 'All Crimes' },
			{ value: 1, text: 'Violent Crimes' },
			{ value: 2, text: 'Rough Crimes' },
			{ value: 3, text: 'Non-Violent Crimes' },
			{ value: 'not-approved', text: 'Not approved' },
		],
		fields: [
			{ key: 'category', label: 'Category', class: 'tw-whitespace-nowrap' },
			{ key: 'crime.type', label: 'Type', class: 'tw-whitespace-nowrap' },
			{ key: 'crime.points', label: 'Points' },
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
		}
	}),
	computed: {
		...mapGetters('Auth', ['$user']),
		...mapGetters('Users', ['$users']),
		...mapGetters('Records', ['$records']),
		totalRows() {
			return this.filterredCrimes.length
		},
		filterredCrimes() {
			let records = this.$records
			if (this.filterBy === 'not-approved') {
				records = records.filter(r => !r.confirmedBy)
			}
			else if (this.filterBy !== 'all') {
				records = records.filter(rec => rec.crime.id === this.filterBy)
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
				crime.ref.delete()
			}
		}
	}
}
</script>