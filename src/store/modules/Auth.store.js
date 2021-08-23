import Auth from '../../firebase/auth'
import DB from '../../firebase/db'
import { createMutations, handle } from '../store.helpers'

const initalState = () => ({
	isAuth: false,
	tempUser: null,
	user: {
		id: null,
		role: null
	}
})

const state = initalState()
const mutations = createMutations('SET', 'RESET')

const getters = {
	$user: ({ user }) => user,
	$isAuth: ({ isAuth }) => isAuth,
	$tempUser: state => state.tempUser,
	$authRole: state => state.user.role,

	// Roles
	$isAdmin: state => ['admin'].includes(state.user.role),
	$isViewer: state => ['viewer'].includes(state.user.role),
	$isUser: state => ['user', 'viewer'].includes(state.user.role),
	$isSuperAdmin: state => ['super-admin'].includes(state.user.role),

	$isSubscribed: state => (
		['admin', 'super-admin'].includes(state.user.role) ||
		state.user.isSubscribed === true
	)
}

const actions = {
	signInUser: (_, payload) => Auth.singInUser(payload),
	registerUser: (_, payload) => Auth.registerUser(payload),
	updateProfile: async ({ commit }, [id, user]) => {
		return handle(DB.updateUser(id, user), uUser => {
			commit('SET', { user: uUser })
		})
	},
	signOutUser: async ({ commit }) => {
		return handle(Auth.signOutUser(), () => {
			commit('RESET', initalState())
		})
	},
}

export default {
	state,
	getters,
	actions,
	mutations,
	namespaced: true,
}
