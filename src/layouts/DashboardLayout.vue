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
import {  mapGetters } from 'vuex'

import Sidebar from '../components/Sidebar.vue'
import Drawer from '../components/utils/Drawer.vue'

import BreakpointsMixin from '../mixins/breakpoints.mixin'
import RouteWrapperY from '../components/utils/RouteWrapperY.vue'

export default {
	name: 'DashboardLayout',
	mixins: [BreakpointsMixin],
	components: {
		Sidebar,
		Drawer,
		RouteWrapperY
	},
	data: () => ({
		sidebar: {
			expanded: false
		}
	}),
	watch: {
		'$route.path'() {
			this.sidebar.expanded = false
		}
	},
	computed: {
		...mapGetters('Auth', ['$user'])
	},
	methods: {
		goto(path) {
			this.$router.push(path)
		}
	},
}
</script>