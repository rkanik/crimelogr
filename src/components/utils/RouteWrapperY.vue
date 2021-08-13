<template>
	<transition name="route-transition" mode="out-in">
		<slot></slot>
	</transition>
</template>
<script>
export default {
	name: "RouteWrapperY",
};
</script>

<style>
	.route-transition-enter,
	.route-transition-leave-to {
		opacity: 0;
		transform: translateY(-16px);
	}
	.route-transition-enter-active,
	.route-transition-leave-active {
		transition: all 300ms ease;
	}
	.route-transition-enter-to,
	.route-transition-leave {
		opacity: 1;
		transform: translateY(0);
	}
</style>