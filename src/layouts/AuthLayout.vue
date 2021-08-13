<template>
	<div class="tw-overflow-y-auto tw-px-4">
		<div class="tw-max-w-xl tw-mx-auto tw-w-full">
			<route-wrapper>
				<router-view />
			</route-wrapper>
		</div>
	</div>
</template>

<script>
import RouteWrapper from '@/components/utils/RouteWrapper'
export default {
	name: 'AuthLayout',
	components: {
		RouteWrapper
	}
}
</script>