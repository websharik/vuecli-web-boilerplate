import { createStore } from 'vuex'
import { getField, updateField } from 'vuex-map-fields'

export default createStore({
  state: {
    ip: '127.0.0.1'
  },
  getters: {
    getField
  },
  mutations: {
    updateField,
    setIP(state, ip) {
      state.ip = ip
    }
  },
  actions: {
    async getIP({ commit }) {
      commit('setIP', '192.168.88.1')
    },
    async loadConfig({ commit }, config) {
      commit('setIP', config.ip)
    }
  },
  modules: {}
})
