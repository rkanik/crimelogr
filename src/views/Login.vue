<template>
	<div class="tw-py-5 md:tw-py-10 lg:tw-py-12 xl:tw-py-16">
		<b-card class="md:tw-p-5">
			<img src="@/assets/img/logo-1-transparent.png" alt="Logo" class="tw-h-32" />
			<div class="tw-text-base tw-mt-4 tw-text-red-500">Welcome to CrimeLogr</div>
			<h3 class="tw-text-2xl tw-mt-2">Login with your email and password</h3>
			<hr class="tw-my-4" />
			<form action @submit.prevent="onSignIn">
				<p v-if="error" class="alert alert-danger" role="alert">{{ error }}</p>

				<div class="form-group">
					<label for>Email</label>
					<input type="email" v-model="email" class="form-control" placeholder="Email" required />
				</div>

				<div class="form-group tw-mt-4">
					<label for>Password</label>
					<input type="password" v-model="password" class="form-control" placeholder="Password" required />
				</div>

				<button class="btn btn-success tw-mt-8" :disabled="processing">Sign In</button>
				<p class="mt-2">
					<span class="tw-mr-1">Don't have an account?</span>
					<router-link :to="{ name: 'Register' }" class="tw-text-red-500">Register Now</router-link>
				</p>
			</form>
		</b-card>
	</div>
</template>

<script>
import { mapActions } from 'vuex'
// import firebase from "firebase/app"
// import "firebase/auth"

export default {
	name: 'Login',
	data() {
		return {
			email: '',
			password: '',
			processing: false,
			error: '',
		}
	},
	methods: {
		...mapActions('Auth', ['signInUser']),
		async onSignIn() {
			let { err } = await this.signInUser({
				email: this.email,
				password: this.password
			})
			if (err) this.error = err.message
			this.processing = false
		}
	}
}
</script>