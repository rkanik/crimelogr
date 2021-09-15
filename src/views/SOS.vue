<template>
	<div class="tw-p-5">
		<div
			v-for="(crm, i) in crimes"
			:key="crm.id"
			:class="{'tw-mt-3':i}"
		>
			<crime-checkbox
				:crime="crm"
				:value="type"
				@input="([_,crime])=>{type=crime.type;typeError=false}"
			></crime-checkbox>
		</div>
		<div
			v-if="typeError"
			class="tw-mt-4 tw-max-w-xs tw-mx-auto tw-px-8 tw-text-center tw-text-sm tw-text-red-500"
		>
			Please Select a crime type and then choose any of the app
		</div>
		<div class="tw-text-center tw-mt-4">
			<button @click="onClickSoS">
				<img
					alt
					class="tw-h-12 tw-w-12"
					src="@/assets/img/sos.jpg"
				/>
			</button>
		</div>
	</div>
</template>

<script>
import crimes from '@/data.json'
import CrimeCheckbox from '../components/CrimeCheckbox.vue'
export default {
	name: 'SOS',
	components: { CrimeCheckbox },
	data: () => ({
		crimes,
		type: '',
		typeError: false,
	}),
	methods: {
		onClickSoS() {
			if (!this.type) return (this.typeError = true)
			window.Android.showToast(
				`This is an SOS message from an App called CrimeLogr. This is to let you know I am involved in (or witnessing) the following type of crime: ${this.type}. My current location is here: https://crimelogr.com/home?center={{lat}},{{lng}} \n\n*** This SOS alert was generated from crimelogr app. You can learn more about it and download it from www.crimelogr.com ***`
			)
		},
	}
}
</script>

<style lang='scss'>
</style>