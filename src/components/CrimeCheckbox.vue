<template>
	<div>
		<h4
			class="tw-text-base tw-px-3 tw-py-0.5 tw-rounded"
			:class="{
					'tw-bg-red-500 tw-text-white': crime.id === crimeType.violent,
					'tw-bg-orange-500 tw-text-white': crime.id === crimeType.rough,
					'tw-bg-yellow-500': crime.id === crimeType.nonViolent,
				}"
		>{{crime.category}}</h4>
		<div class="tw-grid tw-grid-cols-2 tw-gap-1 tw-mt-2">
			<div
				:key="j"
				v-for="(subCrime, j) in crime.crimes"
				class="tw-pb-1 tw-px-2 tw-rounded"
				:class="{
						'tw-bg-red-100': crime.id === crimeType.violent,
						'tw-bg-orange-100': crime.id === crimeType.rough,
						'tw-bg-yellow-100': crime.id === crimeType.nonViolent,
					}"
			>
				<check-box
					:color="crime.color"
					:label="subCrime.type"
					:value="subCrime.type === value"
					@input="$emit('input', [crime, subCrime])"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import { _crime } from '../consts'
import CheckBox from './utils/CheckBox.vue'
export default {
	components: { CheckBox },
	name: 'CrimeCheckboxes',
	props: {
		crime: Object,
		value: String
	},
	data: () => ({
		crimeType: _crime
	}),
}
</script>