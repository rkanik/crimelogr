<template>
	<b-modal hide-footer id="modal-record-crime" title="Record Crime: Select one from below">
		<div
			v-if="loading"
			class="tw-absolute tw-z-10 tw-inset-0 tw-grid tw-place-items-center tw-bg-white tw-bg-opacity-60"
		>
			<DoubleBounce />
		</div>

		<div v-for="(crm, i) in crimes" :key="crm.id" :class="{'tw-mt-3':i}">
			<crime-checkbox :crime="crm" :value="record.type" @input="onInputCrime"></crime-checkbox>
		</div>

		<div class="mt-4 tw-px-1">
			<record-form type="Crime" :error="error" @error="error=$event" @submit="onSubmit" />
		</div>
	</b-modal>
</template>

<script>
import { _crime } from '../consts'
import { DoubleBounce } from 'vue-loading-spinner'

import crimes from '@/data.json'
// import CheckBox from './utils/CheckBox.vue'
import RecordForm from './RecordForm.vue'
import CrimeCheckbox from './CrimeCheckbox.vue'

export default {
	name: 'CreateRecordDialog',
	components: {
		// CheckBox,
		DoubleBounce,
		RecordForm,
		CrimeCheckbox
	},
	props: {
		createRecord: Function
	},
	data() {
		return {
			crimes,
			error: '',
			crime: _crime,
			loading: false,
			record: {
				type: '',
				category: '',
				points: 0
			}
		}
	},
	computed: {
		categories() {
			return this.$store.state.categories
		}
	},
	methods: {
		onInputCrime([{ id, category }, { type, points }]) {
			this.record = {
				...this.record,
				categoryId: id,
				type, category, points
			}
			this.error = ''
		},
		async onSubmit(record) {

			if (!this.record.category) {
				return (this.error = 'You must have to select a crime type.')
			}
			else this.error = ''

			this.loading = true
			let res = await this.createRecord({
				...record,
				...this.record
			})
			if (res.err) {
				console.log(res.err)
				this.error = res.err.message
			}
			else this.$bvModal.hide('modal-record-crime')
			this.loading = false
		}
	}
}
</script>
<style lang="scss">
	#modal-record-crime {
		h5.modal-title {
			font-size: 18px;
			max-width: 220px;
			line-height: 1.25;
		}
		button.close[aria-label="Close"] {
			font-size: 32px;
		}
	}
</style>