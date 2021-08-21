export const _isDev = process.env.NODE_ENV === 'development'
export const _googleMapApiKey = process.env.VUE_APP_GMAP_API_KEY
export const _firebaseConfig = {
	apiKey: process.env.VUE_APP_FB_API_KEY,
	authDomain: process.env.VUE_APP_FB_AUTH_DOMAIN,
	projectId: process.env.VUE_APP_FB_PROJECT_ID,
	storageBucket: process.env.VUE_APP_FB_STORAGE_BUCKET,
	messagingSenderId: process.env.VUE_APP_FB_MESSAGING_SENDER_ID,
	appId: process.env.VUE_APP_FB_APP_ID,
	measurementId: process.env.VUE_APP_FB_MEASUREMENT_ID,
}
export const filterRanges = [
	{ value: 3, text: '3 Months' },
	{ value: 6, text: '6 Months' },
	{ value: 12, text: '12 Months' },
	{ value: 24, text: '24 Months' },
	{ value: 36, text: '36 Months' },
]
export const filterOptions = [
	{ value: 'all', text: 'All Crimes' },
	{ value: 1, text: 'Violent Crimes' },
	{ value: 2, text: 'Rough Crimes' },
	{ value: 3, text: 'Non-Violent Crimes' },
	{ value: 'not-approved', text: 'Not approved' },
]
export const countries = [
	{
		code: 'NG',
		text: 'Nigeria',
		value: 'nigeria',
		bound: {
			north: 13.89, south: 4.15,
			west: 2.69, east: 14.67,
		},
		center: {
			lat: 9.074870,
			lng: 7.408752
		}
	},
	{
		code: 'GH',
		text: 'Ghana',
		value: 'ghana',
		bound: {
			north: 11.18, south: 4.68,
			west: -3.45, east: 1.20,
		},
		center: {
			lat: 5.555185,
			lng: -0.211508
		}
	},
	{
		code: 'KE',
		text: 'Kenya',
		value: 'kenya',
		bound: {
			north: 5.20, south: -4.78,
			west: 33.82, east: 42.02,
		},
		center: {
			lat: -1.300243,
			lng: 36.813572
		}
	},
	{
		code: 'ZA',
		text: 'South Africa',
		value: 'south-africa',
		bound: {
			north: -21.80, south: -35.30,
			west: 16.10, east: 33.23,
		},
		center: {
			lat: -33.922430,
			lng: 18.423597
		}
	},
]
export const _crime = {
	rough: 2,
	violent: 1,
	nonViolent: 3
}
export const _time = (() => {
	let sec = 1000
	let min = sec * 60
	let hour = min * 60
	let day = hour * 24
	let week = day * 7
	let month = day * 30
	let year = day * 365
	return {
		sec, min, hour,
		day, week, month, year
	}
})()