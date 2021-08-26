<template>
	<div class="tw-flex-1 tw-flex tw-flex-col tw-justify-center tw-items-center">
		<img class="tw-h-72" src="@/assets/img/logo-1-transparent.png" alt="Logo" />
		<div class="tw-mt-12">
			<b-button to="/login" variant="success" class="tw-w-full">Login</b-button>
			<b-button to="/register" variant="success" class="tw-w-full tw-mt-3">Registration</b-button>
		</div>
	</div>
</template>

<script>
export default {
	name: 'LandingPage',
}
</script>
