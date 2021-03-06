<template>
	<div class="app-layout tw-flex tw-flex-col tw-overflow-hidden tw-max-w-3xl tw-w-full tw-relative tw-mx-auto">
		<main class="app-layout__main tw-flex-1 tw-flex tw-flex-col tw-overflow-hidden">
			<route-wrapper>
				<router-view />
			</route-wrapper>
		</main>
		<Footer class="tw-flex-none" />
		<SOSDialog
			@sos="onClickSoS"
			:crime-type="sos.crimeType"
			@type="sos.crimeType=$event"
		></SOSDialog>
	</div>
</template>

<script>
import Footer from '@/components/Footer.vue'
import RouteWrapper from '@/components/utils/RouteWrapper'
import SOSDialog from '../components/SOSDialog.vue'
import { mapActions, mapGetters } from 'vuex'
import { Crimes } from '../firebase/init'
import { snapShotToArray } from '../helpers'
import { _time } from '../consts'
export default {
	name: 'AppLayout',
	components: {
		Footer,
		RouteWrapper,
		SOSDialog
	},
	data: () => ({
		sos: {
			crimeType: ""
		},
		unsubscribeCrimes: null,
	}),
	created() {

		// ALL UNCONFIRMED CRIMES
		!this.$isUser && Crimes
			.where('confirmedAt', '==', null).get()
			.then(snapShot => {
				let crimes = snapShotToArray(snapShot)
				this.concatCrimes(crimes)
			})

		// USER'S UNCONFIRMED CRIMES
		this.$isUser && Crimes
			.where('recordedBy', '==', this.$user.userId)
			.where('confirmedAt', '==', null).get()
			.then(snapShot => {
				let crimes = snapShotToArray(snapShot)
				this.concatCrimes(crimes)
			})

		// ON NEW CRIME
		if (this.unsubscribeCrimes) this.unsubscribeCrimes()
		this.unsubscribeCrimes = Crimes
			.limit(1)
			.orderBy('updatedAt', 'desc')
			.onSnapshot(snapShot => {
				if (!snapShot.size) return
				let [crime] = snapShotToArray(snapShot)
				if (!this.doesSatisfyFilter(crime, this.$filter)) return
				this.isExist(crime)
					? this.updateCrime(crime)
					: this.pushCrime(crime)
			})
	},
	computed: {
		...mapGetters('Auth', ['$user', '$isUser']),
		...mapGetters('Records', ['$records', '$filter']),
	},
	watch: {
		'$user.country': {
			immediate: true,
			handler(country) {
				this.setFilter({
					...this.$filter, country
				})
			}
		},
		$filter: {
			deep: true,
			immediate: true,
			handler(filter) {
				let crimesQuery = Crimes
					.orderBy('confirmedAt', 'desc')

				// FILTER BY COUNTRY AND DATE
				if (filter.country !== 'all') crimesQuery = crimesQuery.where('country', '==', filter.country)
				crimesQuery = crimesQuery.where('confirmedAt', '>=', Date.now() - (_time.month * filter.range))

				if (this.$isUser) crimesQuery = crimesQuery.where('confirmedAt', '!=', null)

				// GET ALL CRIMES
				crimesQuery
					.limit(100).get()
					.then(snapShot => {
						let crimes = snapShotToArray(snapShot)
						this.setRecords(crimes)
					})
			}
		}
	},
	methods: {
		...mapActions('Records', [
			'setRecords', 'setFilter',
			'pushCrime', 'concatCrimes', 'updateCrime'
		]),
		onClickSoS() {
			if (window.Android) window.Android.openShareDialog(
				`This is an SOS message from an App called CrimeLogr. This is to let you know I am involved in (or witnessing) the following type of crime: ${this.sos.crimeType}. My current location is here: https://crimelogr.com/home?center={{lat}},{{lng}} \n\n*** This SOS alert was generated from crimelogr app. You can learn more about it and download it from www.crimelogr.com ***`
			)
			else {
				console.log('NO window.Android')
			}
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
		},
		doesSatisfyFilter(crime, filter) {
			if (crime.createdAt < Date.now() - (_time.month * filter.range)) return false
			if (filter.country !== 'all' && crime.country !== filter.country) return false
			if (this.$isUser && !crime.confirmedAt && crime.recordedBy !== this.$user.userId) return false
			return true
		},
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
