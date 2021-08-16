<template>
	<div class="tw-py-5 md:tw-py-10 lg:tw-py-12 xl:tw-py-16">
		<b-card class="md:tw-p-5">
			<div class="tw-text-base">Unverified account</div>
			<h3 class="tw-text-2xl">Please verify your account</h3>
			<hr class="tw-my-4" />
			<div v-if="emailSentError">Too many request. Please try again later.</div>
			<div v-else-if="emailSent">
				And email sent to
				<span class="tw-text-green-500">{{$tempUser.email}}</span>.
				Please click the verification link to verify your account. Didn't get any email?
				<button
					@click="sendEmail"
					class="tw-text-green-500"
				>resend</button>
			</div>
			<b-button v-else @click="sendEmail">Send email verification link</b-button>
			<button @click="onSignOutUser" class="tw-mt-2 tw-text-green-500">Use another account instead</button>
		</b-card>
	</div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
	name: 'VeifyEmail',
	data: () => ({
		emailSent: false,
		emailSentError: false,
	}),
	computed: {
		...mapGetters('Auth', ['$tempUser'])
	},
	methods: {
		...mapMutations('Auth', ['SET']),
		...mapActions('Auth', ['signOutUser']),
		onSignOutUser() {
			this.signOutUser()
			this.SET({ tempUser: null })
			this.$router.replace('/login')
		},
		sendEmail() {
			if (!this.$tempUser) return
			this.$tempUser.ref
				.sendEmailVerification({ url: `${location.origin}/home` })
				.then(() => { this.emailSent = true; this.emailSentError = false })
				.catch(() => { this.emailSentError = true; this.emailSent = false })
		}
	}
}
</script>