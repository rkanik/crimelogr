<template>
	<b-container class="tw-py-4 tw-flex-1 scrollbar-y">
		<b-form @submit.prevent="updateProfileDetails">
			<b-card>
				<b-card-header class="tw-bg-green-600 tw-text-white tw--mx-4 tw--mt-4">
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
							<option
								:key="country.code"
								:value="country.value"
								v-for="country in countries"
							>{{country.text}}</option>
						</select>
					</div>
				</b-card-text>
			</b-card>
			<b-button @click="onSignOut" type="button" variant="danger" class="tw-mt-4">Signout</b-button>
			<button
				v-if="update"
				type="submit"
				class="btn btn-success tw-mt-4 tw-ml-3"
				:disabled="processing"
			>Save details</button>
			<button
				type="button"
				@click="onSendResetPassMail"
				class="btn btn-primary tw-mt-4 tw-ml-3"
			>Change Password</button>
		</b-form>
	</b-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { countries } from '../consts'
import { Auth } from '../firebase/init'
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
			properties: [
				'name', 'dob', 'email',
				'gender', 'phoneNumber', 'country'
			]
		}
	},
	computed: {
		...mapGetters('Auth', ['$user'])
	},
	watch: {
		'$user.id': {
			deep: true,
			immediate: true,
			handler(id) {
				if (!id) return
				this.user = only(
					this.$user,
					this.properties
				)
			}
		}
	},
	methods: {
		...mapActions('Auth', ['signOutUser', 'updateProfile']),
		async updateProfileDetails() {
			this.processing = true
			await this.updateProfile([
				this.$user.id, only(this.user, this.properties)
			])
			this.update = false
			this.processing = false
		},
		async onSignOut() {
			if (confirm("Are you sure to signout?")) {
				await this.signOutUser()
			}
		},
		async onSendResetPassMail() {
			Auth.sendPasswordResetEmail(this.$user.email)
				.then(() => {
					alert(`A password reset email sent to ${this.$user.email}. Please check your email.`);
				})
				.catch((error) => {
					alert(`Error while sending password reset email. ${error.message}`)
				});
		},
		onCancelUpdate() {
			this.update = false
			this.user = { ...this.$user }
		}
	}
}
</script>
