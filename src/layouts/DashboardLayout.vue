<template>
	<div class="tw-flex tw-flex-col tw-overflow-hidden">
		<b-navbar toggleable="lg" type="dark" variant="success" class="px-3 tw-flex-none">
			<b-navbar-brand href="#">
				<b-button
					v-if="bp.smAndDown"
					@click="sidebar.expanded = true"
					class="tw-bg-transparent tw-w-8 tw-px-1 tw-py-0 tw-border-none"
				>
					<b-icon icon="list" class="tw-text-2xl"></b-icon>
				</b-button>
				<span class="tw-inline-block tw-ml-2 tw-capitalize">{{$user.role.split('-').join(' ')}}</span>
			</b-navbar-brand>
		</b-navbar>

		<div class="tw-flex tw-flex-1 tw-overflow-hidden">
			<sidebar v-if="bp.mdAndUp" class="tw-flex-none tw-w-52 xl:tw-w-60 tw-border-r tw-p-3"></sidebar>
			<main class="p-3 tw-flex-1 scrollbar-y">
				<route-wrapper-y>
					<router-view />
				</route-wrapper-y>
			</main>
		</div>

		<drawer maxWidth="320px" v-if="bp.smAndDown" v-model="sidebar.expanded">
			<sidebar show-header :user="$user" @drawer="sidebar.expanded=$event" class="tw-p-5 tw-flex-1"></sidebar>
		</drawer>
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import Sidebar from '../components/Sidebar.vue'
import Drawer from '../components/utils/Drawer.vue'

import BreakpointsMixin from '../mixins/breakpoints.mixin'
import RouteWrapperY from '../components/utils/RouteWrapperY.vue'
import { Crimes } from '../firebase/init'
import { snapShotToArray } from '../helpers'
import { _time } from '../consts'

export default {
	name: 'DashboardLayout',
	mixins: [BreakpointsMixin],
	components: {
		Sidebar,
		Drawer,
		RouteWrapperY
	},
	data: () => ({
		unsubscribeCrimes: null,
		sidebar: {
			expanded: false
		}
	}),
	created() {
		// ON NEW CRIME
		if (this.unsubscribeCrimes) this.unsubscribeCrimes()
		this.unsubscribeCrimes = Crimes
			.limit(1)
			.orderBy('updatedAt', 'desc')
			.onSnapshot(snapShot => {
				if (!snapShot.size) return
				let [crime] = snapShotToArray(snapShot)
				if (!this.doesSatisfyFilter(crime, this.$filter)) return
				this.isExist(crime)
					? this.updateCrime(crime)
					: this.pushCrime(crime)
			})
	},
	watch: {
		'$route.path'() {
			this.sidebar.expanded = false
		},
		$filter: {
			deep: true,
			immediate: true,
			handler(filter) {
				let crimesQuery = Crimes
					.orderBy('createdAt', 'desc')
					.orderBy('updatedAt', 'desc')

				if (filter.country !== 'All Countries') {
					crimesQuery = crimesQuery.where('country', '==', filter.country)
				}
				if (filter.type === 'not-approved') {
					crimesQuery = crimesQuery.where('confirmedBy', '==', null)
				}
				else if (filter.type !== 'all') {
					crimesQuery = crimesQuery.where('categoryId', '==', filter.type)
				}
				crimesQuery = crimesQuery.where('createdAt', '>=', Date.now() - (_time.month * filter.range))

				// GET ALL CRIMES
				crimesQuery
					.limit(100).get()
					.then(snapShot => {
						let crimes = !snapShot.empty
							? snapShotToArray(snapShot) : []
						this.setRecords(crimes)
					})
			}
		}
	},
	computed: {
		...mapGetters('Auth', ['$user']),
		...mapGetters('Records', ['$records', '$filter']),
	},
	methods: {
		...mapActions('Records', [
			'setRecords', 'pushCrime', 'updateCrime'
		]),
		doesSatisfyFilter(crime, filter) {
			if (filter.country !== 'All Countries' && crime.country !== filter.country) return false
			if (filter.type === 'not-approved' && !crime.confirmedBy) return false
			else if (filter.type !== 'all' && filter.type !== crime.categoryId) return false
			if (crime.createdAt < Date.now() - (_time.month * filter.range)) return false
			return true
		},
		goto(path) {
			this.$router.push(path)
		},
		isExist(crime) {
			return this.$records.some(
				crm => crm.id === crime.id
			)
		},
		
	},
}
</script>