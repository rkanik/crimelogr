<template>
	<div class="tw-overflow-y-auto tw-px-4 tw-flex tw-flex-col">
		<div class="tw-max-w-xl tw-mx-auto tw-w-full tw-flex-1 tw-flex tw-flex-col">
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