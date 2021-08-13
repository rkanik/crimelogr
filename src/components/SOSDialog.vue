<template>
	<b-modal hide-footer id="modal-sos" title="Select crime type">
		<div v-for="(crm, i) in crimes" :key="crm.id" :class="{'tw-mt-3':i}">
			<crime-checkbox :crime="crm" :value="type" @input="([_,crime])=>{type=crime.type}"></crime-checkbox>
		</div>
		<div class="tw-space-x-3 tw-mt-4">
			<div class="tw-w-16 tw-mx-auto">
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
