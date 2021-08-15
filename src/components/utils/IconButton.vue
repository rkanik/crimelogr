<template>
	<button
		@click="$emit('click', $event)"
		class="tw-h-11 tw-w-11 tw-rounded-md tw-transition-all tw-grid tw-place-items-center"
		:class="{'tw-text-2xl': icon}"
	>
		<slot v-if="icon" name="icon">
			<b-icon :icon="icon"></b-icon>
		</slot>
		<slot></slot>
	</button>
</template>

<script>
export default {
	name: 'IconButton',
	props: ['icon']
}
</script>