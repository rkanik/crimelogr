<template>
	<button
		@click="$emit('click', $event)"
		class="tw-h-11 tw-w-11 tw-rounded-md tw-transition-all tw-grid tw-place-items-center tw-text-2xl"
	>
		<slot name="icon">
			<b-icon :icon="icon"></b-icon>
		</slot>
		<slot></slot>
	</button>
</template>

<script>
export default {
	name: 'IconButton2',
	props: ['icon']
}
</script>