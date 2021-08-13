<template>
	<div class="Users">
		<div class="tw-flex tw-items-center tw-mb-4 tw-flex-wrap">
			<h4 class="tw-text-xl tw-flex-none">Users List</h4>
			<b-form-select
				size="sm"
				v-model="filterBy"
				:options="filterOptions"
				class="tw-border tw-rounded tw-pl-2 tw-pr-4 tw-py-1 tw-ml-auto"
			/>
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
			:items="filterredUsers"
			:current-page="currentPage"
		>
			<template #row-details="row">
				<div class="tw-grid tw-grid-cols-2 sm:tw-grid-cols-4 tw-py-4">
					<div>
						<div class="tw-uppercase tw-text-gray-500 tw-text-xs">Date of birth</div>
						<div>{{row.item.dob}}</div>
					</div>
					<div>
						<div class="tw-uppercase tw-text-gray-500 tw-text-xs">Gender</div>
						<div class="tw-capitalize">{{row.item.gender}}</div>
					</div>
					<div>
						<div class="tw-uppercase tw-text-gray-500 tw-text-xs tw-mt-2 sm:tw-mt-0">Country of Interest</div>
						<div>{{row.item.country}}</div>
					</div>
					<div>
						<div class="tw-uppercase tw-text-gray-500 tw-text-xs tw-mt-2 sm:tw-mt-0">Joined At</div>
						<div>{{$m(row.item.createdAt).format('DD/MM/YYYY')}}</div>
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
					<Menu
						v-model="row.item.menu"
						v-if="row.item.role !== 'super-admin' && ($isSuperAdmin || $isAdmin && row.item.role !== 'admin')"
						contentClass="tw-w-48 tw-right-0 tw-bg-white tw-boder"
					>
						<template #toggler="{on}">
							<icon-button-2 v-on="on" icon="three-dots"></icon-button-2>
						</template>
						<div>
							<b-list-group>
								<b-list-group-item
									v-if="row.item.role ==='user'"
									@click="toggleSubscription(row.item)"
								>{{row.item.isSubscribed ? 'Revoke' : 'Give'}} Subscription</b-list-group-item>
								<b-list-group-item
									v-if="$isSuperAdmin"
									:disabled="$isAdmin && row.item.role === 'admin'"
									@click="toggleRole(row.item)"
								>{{row.item.role==='admin' ? 'Demote to user' : 'Promote to Admin'}}</b-list-group-item>
								<b-list-group-item @click="onDeleteUser(row.item)">Delete</b-list-group-item>
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
import Menu from '../../components/utils/Menu.vue'
import IconButton2 from '../../components/utils/IconButton2.vue'
import BreakpointsMixin from '../../mixins/breakpoints.mixin'
import { Users } from '../../firebase/init'
import { snapShotToArray } from '../../helpers'
export default {
	name: 'Users',
	mixins: [BreakpointsMixin],
	components: {
		Menu,
		IconButton2
	},
	data: () => ({
		filterBy: 'all',
		filterOptions: [
			{ value: 'all', text: 'All Users' },
			{ value: 'user', text: 'Only Users' },
			{ value: 'admin', text: 'Only Admins' },
		],
		fields: [
			{ key: 'userId', label: 'User ID' },
			{ key: 'name', label: 'Name', class: 'tw-whitespace-nowrap' },
			{ key: 'email', label: 'Email', class: 'tw-whitespace-nowrap' },
			{ key: 'phoneNumber', label: 'Phone number' },
			{ key: 'role', label: 'Role', formatter: v => v.split('-').join(' '), class: 'tw-capitalize' },
			{
				key: 'isSubscribed',
				label: 'Subscribed',
				class: 'md:tw-text-center',
				formatter: (value, key, item) => {
					return (value || ['admin', 'super-admin'].includes(item.role)) ? '✅' : null
				}
			},
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
	created() {
		Users
			.limit(100)
			.orderBy('createdAt', 'desc')
			.onSnapshot(snapshot => {
				this.setUsers(snapShotToArray(snapshot))
			})
	},
	computed: {
		...mapGetters('Users', ['$users']),
		...mapGetters('Auth', ['$user', '$isAdmin', '$isSuperAdmin']),
		totalRows() {
			return this.filterredUsers.length
		},
		mappedUsers() {
			return this.$users
				.filter(u => u.id !== this.$user.id)
				.map(u => ({ ...u, menu: false }))
		},
		filterredUsers() {
			let users = this.mappedUsers
			if (this.filterBy !== 'all') {
				users = users.filter(
					user => user.role === this.filterBy
				)
			}
			if (this.search.keyword.trim()) {
				let keyword = this.search.keyword.trim().toLowerCase()
				users = users.filter(user => {
					return Object.values(user).some(v => {
						return typeof v === 'string'
							? v.toLowerCase().includes(keyword)
							: v == keyword
					})
				})
			}
			return users
		}
	},
	methods: {
		...mapActions('Users', ['setUsers']),
		toggleSubscription(user) {
			user.ref.update({
				isSubscribed: !user.isSubscribed
			})
		},
		toggleRole(user) {
			user.ref.update({
				role: user.role === 'admin'
					? 'user'
					: 'admin'
			})
		},
		onDeleteUser(user) {
			if (confirm(`Are you sure to delete ${user.name}`)) {
				user.ref.delete()
			}
		}
	}
}
</script>