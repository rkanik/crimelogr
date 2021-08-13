<template>
	<div class="tw-py-5 md:tw-py-10 lg:tw-py-12 xl:tw-py-16">
		<b-card class="md:tw-p-5">
			<div>Welcome to CrimeLogr</div>
			<h3>Create new Account</h3>
			<hr />

			<form @submit.prevent="onRegister">
				<p v-if="error" class="alert alert-danger" role="alert">{{ error }}</p>
				<div class="form-group">
					<label for>Name</label>
					<input
						required
						type="text"
						v-model="user.name"
						class="form-control"
						placeholder="Enter your fullname"
					/>
				</div>
				<div class="form-group tw-mt-4">
					<label for>Email Address</label>
					<input
						required
						type="email"
						v-model="user.email"
						class="form-control"
						placeholder="Enter your email address"
					/>
				</div>
				<div class="form-group tw-mt-4">
					<label for>Phone Number</label>
					<input
						required
						type="tel"
						v-model="user.phoneNumber"
						class="form-control"
						placeholder="Phone Number"
					/>
				</div>
				<div class="form-group tw-mt-4">
					<label for>Gender</label>
					<select required name="gender" id="gender" v-model="user.gender" class="form-control">
						<option value>Select your gender</option>
						<option value="male">Male</option>
						<option value="female">Female</option>
					</select>
				</div>
				<div class="form-group tw-mt-4">
					<label>Date of Birth</label>
					<b-form-datepicker required locale="en" v-model="user.dob"></b-form-datepicker>
				</div>
				<div class="form-group tw-mt-4">
					<label>Country of Interest</label>
					<select required name="Country" v-model="user.country" class="form-control">
						<option value>Select country of interest</option>
						<option v-for="country in countries" :key="country" :value="country">{{country}}</option>
					</select>
				</div>
				<div class="form-group tw-mt-4">
					<label>Password</label>
					<input
						required
						type="password"
						class="form-control"
						v-model="user.password"
						@input="matchConfirmPassword"
						placeholder="Enter your password"
					/>
				</div>
				<div class="form-group tw-mt-4">
					<label>Confirm Password</label>
					<input
						required
						type="password"
						class="form-control"
						v-model="confirmPassword"
						@input="matchConfirmPassword"
						placeholder="Enter your password again"
					/>
					<div v-if="confirmPasswordErr" class="tw-text-sm tw-text-red-500 mt-1">{{confirmPasswordErr}}</div>
				</div>
				<button class="btn btn-success tw-mt-8">Register</button>
				<p class="tw-mt-2">
					Already have an account?
					<router-link class="tw-text-green-500" :to="{ name: 'Login' }">Login here</router-link>
				</p>
			</form>
		</b-card>
	</div>
</template>

<script>
import { mapActions } from 'vuex'
import { countries } from '../consts'
import { miniId } from '../helpers'
export default {
	name: 'Register',
	data() {
		return {
			countries,
			user: {
				userId: 'CL' + miniId(10).toUpperCase(),
				name: '',
				gender: '',
				phoneNumber: '',
				email: '',
				dob: '',
				role: 'user',
				password: '',
				country: ''
			},
			confirmPassword: '',
			confirmPasswordErr: null,
			processing: false,
			error: '',
		}
	},
	methods: {
		...mapActions('Auth', ['registerUser']),
		matchConfirmPassword() {
			if (!this.user.password || !this.confirmPassword) return
			this.confirmPasswordErr = (
				this.user.password !== this.confirmPassword
					? 'Password doesn\'t matched'
					: null
			)
		},
		async onRegister() {
			let hasEmpty = Object.values(this.user).some(v => !v)
			if (hasEmpty || this.confirmPasswordErr) return (this.error = 'Please fill all the fields.')

			this.processing = true
			let { err } = await this.registerUser({
				...this.user,
				createdAt: Date.now(),
				updatedAt: Date.now()
			})
			if (err) this.error = err.message
			this.processing = false
		}
	}
}
</script>