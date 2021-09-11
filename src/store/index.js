import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		memoryCards: null,
		snakesAndLadders: null,
	},
	mutations: {
		SET_MEMORYCARDS(state, memoryCards) {
			state.memoryCards = memoryCards
		},

		SET_MEMORYCARDS_FULLPLAYERS(state, players) {
			state.memoryCards.players = players
		},

		INITIALIZE_MEMORYCARDS(state) {
			state.memoryCards = null
		},

		SET_SNAKESANDLADDERS(state, snakesAndLadders) {
			state.snakesAndLadders = snakesAndLadders
		},

		SET_SNAKESANDLADDERS_FULLPLAYERS(state, players) {
			state.snakesAndLadders.players = players
		},

		INITIALIZE_SNAKESANDLADDERS(state) {
			state.snakesAndLadders = null
		},
	},
	actions: {
		setMemoryCards({ commit }, memoryCards) {
			commit('SET_MEMORYCARDS', memoryCards)
		},

		setMemoryCardsPlayers({ commit }, players) {
			commit('SET_MEMORYCARDS_FULLPLAYERS', players)
		},

		initializeMemoryCards({ commit }) {
			commit('INITIALIZE_MEMORYCARDS')
		},

		setSnakesAndLadders({ commit }, snakesAndLadders) {
			commit('SET_SNAKESANDLADDERS', snakesAndLadders)
		},

		setSnakesAndLaddersPlayers({ commit }, players) {
			commit('SET_SNAKESANDLADDERS_FULLPLAYERS', players)
		},

		initializeSnakesAndLadders({ commit }) {
			commit('INITIALIZE_SNAKESANDLADDERS')
		},
	},
	modules: {},
	plugins: [createPersistedState()],
})
