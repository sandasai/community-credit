import Vue from 'vue'
import Vuex from 'vuex'
import * as Auth from './auth'
import * as Api from './api'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    slack: null,
    token: Auth.isAuthorized(),
    id: Number(Auth.getUserId()),
    name: Auth.isAuthorized() ? Auth.getUserName() : null,
    request: {},
    requests: [],
    item: {},
    items: []
  },
  mutations: {
    slack (state, slack) { state.slack = slack },
    storeToken (state, token) {
      state.token = token
    },
    setId (state, id) {
      state.id = Number(id)
    },
    setRequest (state, request) { state.request = request },
    setRequests (state, requests) { state.requests = requests },
    setItem (state, item) { state.item = item },
    setItems (state, items) { state.items = items },
    setName (state, name) { state.name = name }
  },
  actions: {
    async getRequest ({ commit }, id) {
      const request = await Api.getRequest(id)
      commit('setRequest', request)
    },
    async getRequests ({ commit }) {
      const requests = await Api.getRequests()
      commit('setRequests', requests)
    },
    async putRequest ({ dispatch, commit }, { id, item, description }) {
      const request = await Api.putRequest(id, item, description)
      commit('setRequest', request)
      await dispatch('getRequests')
    },
    async deleteRequest ({ dispatch, commit }, id) {
      const result = await Api.deleteRequest(id)
      if (result) {
        await commit('setRequest', null)
        await dispatch('getRequests')
      }
    },
    async postRequest ({ dispatch, commit }, { item, description }) {
      const request = await Api.uploadRequest(item, description)
      await dispatch('getRequests')
      await dispatch('getRequest', request.id)
    },
    async getItem ({ commit }, id) {
      const item = await Api.getItem(id)
      commit('setItem', item)
    },
    async getItems ({ commit }, search = null) {
      const items = await Api.getItems(search)
      commit('setItems', items)
    },
    async putItem ({ dispatch, commit }, { id, name, description, status }) {
      await Api.putItem(id, name, description, status)
      await dispatch('getItem', id)
    },
    async postItemComment ({ commit, dispatch }, { id, comment }) {
      await Api.postItemComment(id, comment)
      await dispatch('getItem', id)
    },
    async deleteItemLog ({ dispatch, state }, id) {
      await Api.deleteItemLog(state.item.id, id)
      await dispatch('getItem', state.item.id)
    }
  }
})

export default store
