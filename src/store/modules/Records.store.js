import DB from '../../firebase/db'
import { createMutations, handle } from '../store.helpers'

const initalState = () => ({
	records: [],
	filter: {
		range: 12, // range in months
		type: 'all',
		country: 'all',
	}
})

const state = initalState()
const mutations = createMutations('SET', 'PUSH', 'CONCAT', 'UPDATE', 'DELETE')

const getters = {
	$filter: state => state.filter,
	$records: state => state.records,
}

const actions = {
	createRecord: (_, payload) => handle(
		DB.addBuildingRecord(payload)
	),
	getRecords: ({ commit }, payload) => handle(
		DB.getBuildingRecords(payload), (records = []) => {
			commit('SET', { records })
		}),
	deleteRecord: async ({ commit }, doc) => {
		await doc.ref.delete()
		commit('DELETE', ['records', doc.id])
	},
	setRecords: ({ commit }, records) => {
		commit('SET', { records })
	},
	pushCrime: ({ commit }, record) => {
		commit('PUSH', ['records', record])
	},
	concatCrimes: ({ commit }, crimes) => {
		commit('CONCAT', ['records', crimes])
	},
	updateCrime: ({ commit }, crime) => {
		commit('UPDATE', ['records', crime])
	},
	setFilter({ commit }, filter) {
		commit('SET', { filter })
	}
}

export default {
	state,
	getters,
	actions,
	mutations,
	namespaced: true,
}
