<template>
	<b-modal
		hide-footer
		id="modal-sos"
		title="Select crime type based on your current location and send it as SOS message"
	>
		<div
			v-for="(crm, i) in crimes"
			:key="crm.id"
			:class="{'tw-mt-3':i}"
		>
			<crime-checkbox
				:crime="crm"
				:value="type"
				@input="([_,crime])=>{type=crime.type}"
			></crime-checkbox>
		</div>
		<div class="tw-flex tw-items-center tw-justify-center tw-space-x-4 tw-mt-4">
			<button>
				<img
					alt
					@click="type && $emit('whatsapp',{ type })"
					class="tw-h-12 tw-w-12"
					src="@/assets/img/whatsapp.png"
				/>
			</button>
			<div class="tw-w-16">
				<button
					@click="type && $emit('sos',{ type })"
					class="tw-w-16 tw-h-16 tw-rounded-full tw-overflow-hidden"
				>
					<img
						alt="sos button"
						src="@/assets/img/sos.jpg"
						class="tw-h-full tw-w-full tw-transform tw-scale-110"
					/>
				</button>
			</div>
			<div class="tw-w-12">

			</div>
		</div>
	</b-modal>
</template>

<script>
import crimes from '@/data.json'
import CrimeCheckbox from './CrimeCheckbox.vue'
export default {
	components: { CrimeCheckbox },
	name: 'SOSDialog',
	data: () => ({
		crimes,
		type: ''
	}),
}
</script>
