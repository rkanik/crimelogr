<template>
	<div class="tw-flex tw-flex-col tw-justify-between">
		<div v-if="showHeader" class="tw-flex tw-items-center tw-mb-8 tw-justify-between">
			<span class="tw-capitalize tw-text-xl tw-font-medium">{{user.role.split('-').join(' ')}}</span>
			<b-icon @click="$emit('drawer', false)" icon="x" class="tw-text-3xl"></b-icon>
		</div>
		<div class="tw-space-y-1 tw-flex-1">
			<template v-for="(route, routeIndex) in routes">
				<router-link
					:to="route.path"
					:key="routeIndex"
					v-if="route.requireRoles.includes(user.role)"
					class="tw-flex tw-items-center tw-space-x-2 tw-no-underline tw-py-1.5 tw-px-2 tw-rounded tw-transition-all tw-duration-500"
					:class="[$route.path === route.path ? 'tw-bg-green-500 tw-text-white':'tw-text-green-600 hover:tw-bg-gray-200']"
				>
					<b-icon :icon="route.icon" class="tw-text-base"></b-icon>
					<div>{{route.name}}</div>
				</router-link>
			</template>
		</div>
		<div class="tw-h-12 tw-flex tw-items-center">
			<button
				@click="onSignOut"
				class="tw-flex tw-items-center tw-space-x-2 hover:tw-text-red-500 tw-transition-all tw-duration-500"
			>
				<b-icon icon="box-arrow-left" class="tw-text-base"></b-icon>
				<div>Logout</div>
			</button>
		</div>
	</div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
	name: 'Sidebar',
	props: {
		user: Object,
		showHeader: Boolean
	},
	data: () => ({
		routes: [
			{
				name: 'Home',
				path: '/home',
				icon: 'house-door',
				requireRoles: ['admin', 'super-admin', 'viewer', 'user']
			},
			{
				name: 'Map',
				icon: 'map',
				path: '/admin/map',
				requireRoles: ['admin', 'super-admin', 'viewer']
			},
			{
				name: 'Crimes',
				icon: 'view-list',
				path: '/admin/crimes',
				requireRoles: ['admin', 'super-admin']
			},
			{
				name: 'Users',
				icon: 'people',
				path: '/admin/users',
				requireRoles: ['admin', 'super-admin']
			}
		]
	}),
	methods: {
		...mapActions('Auth', ['signOutUser']),
		async onSignOut() {
			if (confirm("Are you sure to signout?")) {
				await this.signOutUser()
			}
		},
	}
}
</script>