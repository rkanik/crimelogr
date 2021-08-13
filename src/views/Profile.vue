<template>
	<b-container class="tw-py-4 tw-flex-1 scrollbar-y">
		<b-form @submit.prevent="updateProfileDetails">
			<b-card>
				<b-card-header class="tw-bg-blue-500 tw-text-white">
					<b-card-title class="tw-mb-0 tw-font-medium tw-flex tw-items-center tw-justify-between">
						<span>User Profile</span>
						<b-button v-if="!update" @click="update=true" variant="white" class="tw-text-white tw-px-2">
							<b-icon icon="pencil-square"></b-icon>
						</b-button>
						<b-button
							v-else
							variant="white"
							@click="onCancelUpdate"
							class="tw-text-white tw-px-2 tw-text-base"
						>
							<b-icon icon="x" class="tw-transform tw-scale-150"></b-icon>
						</b-button>
					</b-card-title>
				</b-card-header>
				<b-card-text class="tw-mt-4">
					<div class="form-group">
						<label for>Name</label>
						<input
							required
							type="text"
							v-model="user.name"
							class="form-control"
							placeholder="Name"
							:disabled="!update"
						/>
					</div>
					<div class="form-group tw-mt-4">
						<label for>Email</label>
						<input
							required
							type="email"
							v-model="user.email"
							class="form-control"
							placeholder="Email address"
							:disabled="!update"
						/>
					</div>
					<div class="form-group tw-mt-4">
						<label for>Phone Number</label>
						<input
							required
							type="text"
							class="form-control"
							v-model="user.phoneNumber"
							placeholder="Phone Number"
							:disabled="!update"
						/>
					</div>
					<div class="form-group tw-mt-4">
						<label for>Gender</label>
						<select
							required
							id="gender"
							name="gender"
							v-model="user.gender"
							class="form-control"
							:disabled="!update"
						>
							<option value>Select Gender</option>
							<option value="male">Male</option>
							<option value="female">Female</option>
						</select>
					</div>
					<div class="form-group tw-mt-4">
						<label for>Date of Birth</label>
						<b-form-datepicker required locale="en" :disabled="!update" v-model="user.dob"></b-form-datepicker>
					</div>
					<div class="form-group tw-mt-4">
						<label>Country of Interest</label>
						<select
							required
							name="Country"
							:disabled="!update"
							v-model="user.country"
							class="form-control"
						>
							<option value>Select country of interest</option>
							<option v-for="country in countries" :key="country" :value="country">{{country}}</option>
						</select>
					</div>
				</b-card-text>
			</b-card>
			<b-button @click="onSignOut" type="button" variant="danger" class="tw-mt-4">Signout</b-button>
			<button
				v-if="update"
				type="submit"
				class="btn btn-primary tw-mt-4 tw-ml-4"
				:disabled="processing"
			>Save details</button>
		</b-form>
	</b-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { countries } from '../consts'
import { only } from '../helpers'
export default {
	name: 'Profile',
	data() {
		return {
			countries,
			update: false,
			user: {
				name: '',
				age: '',
				gender: '',
				dob: '',
				phoneNumber: '',
			},
			processing: false,
		}
	},
	computed: {
		...mapGetters('Auth', ['$user'])
	},
	watch: {
		$user: {
			deep: true,
			immediate: true,
			handler(user) {
				if (user.id) {
					this.user = { ...user }
				}
			}
		}
	},
	methods: {
		...mapActions('Auth', ['signOutUser', 'updateProfile']),
		async updateProfileDetails() {
			this.processing = true
			await this.updateProfile([
				this.$user.id,
				only(this.user, [
					'name', 'dob', 'email',
					'gender', 'phoneNumber', 'country'
				])
			])
			this.update = false
			this.processing = false
			alert("Profile details saved.")
		},
		async onSignOut() {
			if (confirm("Are you sure to signout?")) {
				await this.signOutUser()
			}
		},
		onCancelUpdate() {
			this.update = false
			this.user = { ...this.$user }
		}
	}
}
</script>