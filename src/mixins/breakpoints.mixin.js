export default {
	name: 'BreakpointsMixin',
	data: () => ({
		bp: {
			// EXACT
			xs: false,
			sm: false,
			md: false,
			lg: false,
			// DOWN
			smAndDown: false,
			mdAndDown: false,
			lgAndDown: false,
			// UP
			smAndUp: false,
			mdAndUp: false,
			lgAndUp: false,
		},
		onResizeTimeout: null,
	}),
	created() {
		this.bp = {
			...this.calculateBreakpoint(
				window.innerWidth
			)
		}
	},
	mounted() { window.addEventListener('resize', this.onResize) },
	beforeDestroy() { window.removeEventListener('resize', this.onResize) },
	methods: {
		onResize(e) {
			if (this.onResizeTimeout) return
			this.onResizeTimeout = setTimeout(() => {
				this.bp = {
					...this.calculateBreakpoint(
						e.target.innerWidth
					)
				}
				clearTimeout(this.onResizeTimeout)
				this.onResizeTimeout = null
			}, 750);
		},
		calculateBreakpoint(width) {
			return {
				// EXACT
				xs: eval(`${width} < 576`),
				sm: eval(`${width} >= 576 && ${width} < 768`),
				md: eval(`${width} >= 768 && ${width} < 992`),
				lg: eval(`${width} >= 992 && ${width} < 1200`),
				// DOWN
				smAndDown: eval(`${width} < 768`),
				mdAndDown: eval(`${width} < 992`),
				lgAndDown: eval(`${width} < 1200`),
				// UP
				smAndUp: eval(`${width} >= 576`),
				mdAndUp: eval(`${width} >= 768`),
				lgAndUp: eval(`${width} >= 992`)
			}
		}
	}
}
