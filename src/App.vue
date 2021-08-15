<template>
	<div
		:style="{ height: appHeight + 'px' }"
		class="tw-flex tw-flex-col tw-relative tw-overflow-hidden"
	>
		<div v-if="loading" class="tw-absolute tw-inset-0 tw-grid tw-place-items-center">
			<RotateSquare3 size="64px" />
		</div>
		<router-view v-else class="tw-flex-1" />

		<b-modal centered hide-footer hide-header v-model="subscribeModal">
			<div class="tw-font-medium tw-text-lg tw-text-center">
				Please subscribe to use this feature
				<div class="mt-3">
					<b-button variant="primary" size="sm">Subscribe now</b-button>
				</div>
			</div>
		</b-modal>
	</div>
</template>

<script>
import Auth from "@/firebase/auth"
import { mapActions, mapGetters } from 'vuex'
import RotateSquare3 from 'vue-loading-spinner/src/components/RotateSquare3.vue'
import { Users } from './firebase/init'
import { getCountry } from './helpers'
export default {
	name: 'App',
	components: {
		RotateSquare3
	},
	data: () => ({
		loading: false,
		appHeight: window.innerHeight
	}),
	async created() {
		this.loading = true
		Auth.onStateChanged(user => {
			this.$store.commit('Auth/SET', {
				user: user ? user : { id: null },
				isAuth: user ? true : false,
			})

			// Redirect to login if not logged in
			const requiresAuth = this.$route.matched.some(res => res.meta.requiresAuth)
			if (requiresAuth && !user && this.$route.name !== 'Login') this.$router.replace({ name: 'Login' })

			// Redirect to home if already logged on
			const redirectIsAuth = this.$route.matched.some(res => res.meta.redirectIsAuth)
			if (redirectIsAuth && user && this.$route.name !== 'Home') this.$router.replace({ name: 'Home' })

			this.loading = false

			if (user) {
				Users.doc(user.id).onSnapshot(userSnapshot => {
					this.$store.commit('Auth/SET', {
						user: {
							id: userSnapshot.id,
							...userSnapshot.data()
						},
					})
				})
			}
		})

		let country = await getCountry()
		this.$store.commit('SET', { gpsCountry: country })
	},
	mounted() { window.addEventListener('resize', this.onResize) },
	beforeDestroy() { window.removeEventListener('resize', this.onResize) },
	computed: {
		...mapGetters(['$subscribeModal']),
		subscribeModal: {
			get() {
				return this.$subscribeModal
			},
			set(v) {
				this.toggleSubscribeModal(v)
			}
		}
	},
	methods: {
		...mapActions([
			'toggleSubscribeModal'
		]),
		onResize() {
			this.appHeight = window.innerHeight
		}
	}
}
</script>