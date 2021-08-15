<template>
	<Menu v-model="menu" contentClass="tw-right-0">
		<template #toggler="{on}">
			<slot name="toggler" :on="on" :text="itemText">
				<button
					v-on="on"
					class="tw-w-full tw-h-10 tw-whitespace-nowrap tw-rounded tw-py-1.5 tw-px-4"
					:class="[togglerClass, outlined ? 'tw-border tw-border-gray-400' : '']"
				>{{itemText}}</button>
			</slot>
		</template>
		<div class="tw-w-max tw-mt-1 tw-bg-white tw-py-1 tw-shadow-md tw-rounded-md">
			<div
				:key="item.value || item"
				v-for="(item, itemIndex) in items"
				class="tw-px-5 tw-py-2 tw-text-sm tw-font-medium"
				@click="$emit('input', item.value || item)"
				:class="[
						(item.value || item) === value
							?'tw-text-white tw-bg-green-600'
							:'tw-bg-white tw-text-gray-600', {
							'tw-border-t tw-border-gray-200': itemIndex
						}
					]"
			>{{item.text || item}}</div>
		</div>
	</Menu>
</template>

<script>
import { isObject } from '../../helpers'
import Menu from './Menu.vue'
export default {
	name: 'Dropdown',
	components: { Menu },
	props: {
		items: Array,
		outlined: Boolean,
		value: [String, Number],
		togglerClass: {
			type: String,
			default: 'tw-bg-white tw-text-black',
		}
	},
	data: () => ({
		menu: false
	}),
	computed: {
		itemText() {
			let item = this.items.find(item => {
				let value = isObject(item) ? item.value : item
				return value === this.value
			})
			return isObject(item) ? item.text : item
		}
	}
}
</script>