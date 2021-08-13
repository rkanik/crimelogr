<template>
	<div class="drawer" :class="{'expanded': value}" :style="{ width, maxWidth}">
		<div class="drawer__overlay" @click="$emit('input', false)"></div>
		<div class="drawer__content">
			<slot />
		</div>
	</div>
</template>

<script>
export default {
	name: 'Drawer',
	props: {
		value: Boolean,
		width: {
			default: '80%',
			type: [Number, String],
		},
		maxWidth: {
			default: '400px',
			type: [Number, String],
		}
	}
}
</script>

<style lang='scss'>
	.drawer {
		width: 0;
		left: -100%;
		position: fixed;
		transition: all 300ms ease-in;
		&,
		&__content {
			top: 0;
			bottom: 0;
		}
		&__content,
		&__overlay {
			width: 100%;
		}
		&__content {
			left: 0;
			height: 100%;
			background-color: white;
			position: absolute;
			display: flex;
			flex-direction: column;
		}
		&__overlay {
			top: 0;
			left: 0;
			height: 100%;
			opacity: 0;
			position: fixed;
			visibility: hidden;
			transition: all 300ms ease-in;
			background-color: rgba(#000000, 0.5);
		}
		&.expanded {
			left: 0;
			width: 100%;
			&,
			.drawer__overlay {
				transition-timing-function: ease-out;
			}
			.drawer__overlay {
				opacity: 1;
				visibility: visible;
			}
		}
	}
</style>