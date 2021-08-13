export const _isDev = process.env.NODE_ENV === 'development'
export const _googleMapApiKey = process.env.VUE_APP_GMAP_API_KEY
export const _firebaseConfig = {
	apiKey: process.env.VUE_APP_FB_API_KEY,
	authDomain: process.env.VUE_APP_FB_AUTH_DOMAIN,
	databaseURL: process.env.VUE_APP_FB_DATABASE_URL,
	projectId: process.env.VUE_APP_FB_PROJECT_ID,
	storageBucket: process.env.VUE_APP_FB_STORAGE_BUCKET,
	messagingSenderId: process.env.VUE_APP_FB_MESSAGING_SENDER_ID,
	appId: process.env.VUE_APP_FB_APP_ID,
	measurementId: process.env.VUE_APP_FB_MEASUREMENT_ID,
}
export const filterRanges = [
	{ value: 3, text: '3 Months' },
	{ value: 6, text: '6 Months' },
	{ value: 12, text: '13 Months' },
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
	'All Countries',
	'Nigeria', 'Ghana',
	'South Africa', 'Kenya'
]
export const _crime = {
	rough: 2,
	violent: 1,
	nonViolent: 3
}
export const _nigeriaBounds = {
	north: 13.89, south: 4.15,
	west: 2.69, east: 14.67,
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