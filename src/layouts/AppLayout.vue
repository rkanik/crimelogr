<template>
	<div
		class="app-layout tw-flex tw-flex-col tw-overflow-hidden tw-max-w-3xl tw-w-full tw-relative tw-mx-auto"
	>
		<main class="app-layout__main tw-flex-1 tw-flex tw-flex-col tw-overflow-hidden">
			<route-wrapper>
				<router-view />
			</route-wrapper>
		</main>
		<Footer class="tw-flex-none" />
		<SOSDialog @type="sos.crimeType=$event" @sos="onClickSoS"></SOSDialog>
	</div>
</template>

<script>
import Footer from '@/components/Footer.vue'
import RouteWrapper from '@/components/utils/RouteWrapper'
import SOSDialog from '../components/SOSDialog.vue'
import { mapActions, mapGetters } from 'vuex'
import Auth from "@/firebase/auth"
import { Crimes } from '../firebase/init'
import { snapShotToArray } from '../helpers'
export default {
	name: 'AppLayout',
	components: {
		Footer,
		RouteWrapper,
		SOSDialog
	},
	computed: {
		...mapGetters('Records', ['$records']),
	},
	created() {
		Auth.onStateChanged(user => {
			if (!user) return

			const isUser = user.role === 'user'

			// Confirmed crimes
			let confirmedCrimes = Crimes.where('confirmedBy', '!=', null)
			confirmedCrimes.get().then(this.onCrimesAdded)

			// UnConfirmed crimes
			let unConfirmedCrimes = Crimes.where('confirmedBy', '==', null)
			if (isUser) unConfirmedCrimes = unConfirmedCrimes.where('recordedBy', '==', user.userId)
			unConfirmedCrimes.get().then(this.onCrimesAdded)

			// New crime added
			let newCrimes = Crimes.limit(1).orderBy('createdAt', 'desc')
			newCrimes.onSnapshot(snapShot => {
				if (snapShot.empty) return
				let [crime] = snapShotToArray(snapShot)
				if (isUser && crime.recordedBy !== user.userId && !crime.confirmedAt) return
				if (this.isExist(crime)) return
				this.pushCrime(crime)
			})

			// On Confirmed
			Crimes.limit(1)
				.where('confirmedAt', '!=', null)
				.orderBy('confirmedAt', 'desc')
				.onSnapshot(snapShot => {
					if (snapShot.empty) return
					let [crime] = snapShotToArray(snapShot)
					this.updateCrime(crime)
				})

		})
	},
	methods: {
		...mapActions('Records', [
			'pushCrime', 'concatCrimes', 'updateCrime'
		]),
		async onClickSoS({ type }) {
			navigator.geolocation.getCurrentPosition(position => {
				const { latitude, longitude } = position.coords
				navigator.share({
					title: `CrimeLogr`,
					text: `This is an SOS message to let you know i am involved in (or witnessing) the following type of crime: ${type}. My current location is here: ${latitude},${longitude}.\n\n*** This SOS alert was generated from crimelogr app. You can learn more about it and download it from www.crimelogr.com ***`,
					url: `${location.origin}/home?center=${latitude},${longitude}`,
				})
					.catch(err => {
						console.log('Share cancelled', err)
					})
			})
		},
		isExist(crime) {
			return this.$records.some(
				crm => crm.id === crime.id
			)
		},
		onCrimesAdded(snapShot) {
			let crimes = snapShotToArray(snapShot)
			crimes = crimes.filter(crm => !this.isExist(crm))
			this.concatCrimes(crimes)
		}
	}
}
</script>
<style lang="scss">
	.app-layout {
		&__main {
			padding-bottom: 48px;
		}
	}
</style>
