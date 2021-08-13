<template>
	<button
		@click="$emit('click', $event)"
		class="icon-button2 tw-text-gray-800 tw-bg-gray-100 hover:tw-bg-gray-300"
		:style="style"
	>
		<b-icon :icon="icon" />
	</button>
</template>

<script>
export default {
	name: 'IconButton2',
	props: {
		icon: String,
		iconSize: {
			default: '16',
			type: [String, Number],
		},
		size: {
			default: '32',
			type: [String, Number],
		}
	},
	computed: {
		style() {
			return {
				width: `${this.size}px`,
				height: `${this.size}px`,
				fontSize: `${this.iconSize}px`,
			}
		}
	}
}
</script>

<style lang='scss'>
	.icon-button2 {
		border: none !important;
		outline: none !important;
		padding: 0 !important;
		display: flex !important;
		justify-content: center !important;
		align-items: center !important;
		border-radius: 50% !important;
		transition: all 200ms ease-in-out !important;
	}
</style>