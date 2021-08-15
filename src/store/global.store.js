import { isEmpty } from "../helpers"
import { createMutations } from "./store.helpers"

const initialState = () => ({
	loading: false,
	subscribeModal: false,
	gpsCountry: null
})

export const state = initialState()
export const mutations = createMutations('SET')
export const getters = {
	$loading: s => s.loading,
	$subscribeModal: s => s.subscribeModal,
	$gpsCountry: s => s.gpsCountry
}

export const actions = {
	toggleLoading({ commit, state: { loading } }, payload) {
		commit('SET', {
			loading: isEmpty(payload)
				? !loading
				: payload
		})
	},
	toggleSubscribeModal({ commit, state: { loading } }, payload) {
		commit('SET', {
			subscribeModal: isEmpty(payload)
				? !loading
				: payload
		})
	},
}