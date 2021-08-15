<template>
	<div class>
		<div class="tw-hidden sm:tw-space-x-3 sm:tw-flex">
			<dropdown
				:outlined="outlined"
				v-model="filter.country"
				:items="countries"
				:class="{'tw-shadow':!outlined}"
				:togglerClass="togglerClass"
			></dropdown>
			<dropdown
				:outlined="outlined"
				v-model="filter.type"
				:items="filterOptions"
				:togglerClass="togglerClass"
				:class="{'tw-shadow':!outlined}"
			></dropdown>
			<dropdown
				:outlined="outlined"
				v-model="filter.range"
				:items="filterRanges"
				:togglerClass="togglerClass"
				:class="{'tw-shadow':!outlined}"
			></dropdown>
		</div>
		<Menu
			v-model="filterMenu"
			class="sm:tw-hidden"
			:close-on-content-click="false"
			content-class="tw-right-0 tw-py-2 tw-bg-white tw-rounded tw-border tw-border-gray-300 tw-mt-2"
		>
			<template #toggler="{ on }">
				<icon-button v-on="on" icon="funnel" class="tw-h-10 tw-w-10 tw-bg-green-600 tw-text-white"></icon-button>
			</template>
			<dropdown v-model="filter.country" :items="countries"></dropdown>
			<dropdown v-model="filter.type" :items="filterOptions" class="tw-border-t tw-border-gray-300"></dropdown>
			<dropdown v-model="filter.range" :items="filterRanges" class="tw-border-t tw-border-gray-300"></dropdown>
		</Menu>
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { filterOptions, countries, filterRanges } from '../consts'
import Dropdown from './utils/Dropdown.vue'
import IconButton from './utils/IconButton.vue'
import Menu from './utils/Menu.vue'
export default {
	name: 'CrimeFilters',
	components: { Dropdown, Menu, IconButton },
	props: {
		outlined: Boolean,
		togglerClass: String,
	},
	data: () => ({
		countries,
		filterRanges,
		filterOptions,
		filterMenu: false
	}),
	computed: {
		...mapGetters('Records', ['$filter']),
		filter: {
			get() { return this.$filter },
			set(v) { this.setFilter(v) }
		},
	},
	methods: {
		...mapActions('Records', ['setFilter']),
	}
}
</script>
