import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: '',
    verification: false,
    signInForm: false,
    currentCard: null,
    loading: false,
    widthOnScroll: null,
    heightOnScroll: null,
    width: null,
    height: null,
  },

  mutations: {
    SIGN_IN (state, user_payload) {
      state.user = user_payload
      state.verification = true
    },
    SIGN_OUT (state) {
      state.user = ''
      state.verification = false
    },
    SIGN_IN_FORM (state, user_payload) {
      state.signInForm = user_payload
    },
    SHOW_CARD (state, user_payload) {
      state.currentCard = user_payload
    },
    CLEAR_CARD (state) {
      state.currentCard = ''
    },
    ENABLE_LOADING(state){
      state.loading = true
    },
    DISABLE_LOADING(state){
      state.loading = false
    },
    WIDTH_ON_SCROLL(state, user_payload){
      state.widthOnScroll = user_payload
    },
    HEIGHT_ON_SCROLL(state, user_payload){
      state.heightOnScroll = user_payload
    },
    HEIGHT(state, user_payload){
      state.height = user_payload
    },
    WIDTH(state, user_payload){
      state.width = user_payload
    }
  },

  actions: {
    signIn ({commit}, user_payload) {
      commit('SIGN_IN', user_payload)
    },
    signOut ({commit}) {
      commit('SIGN_OUT')
    },
    signInForm ({commit}, user_payload){
      commit('SIGN_IN_FORM', user_payload)
    },
    showCard ({commit}, user_payload){
      commit('SHOW_CARD', user_payload)
    },
    clearCard({commit}){
      commit('CLEAR_CARD')
    },
    enable_loading({commit}) {
      commit('ENABLE_LOADING')
    },
    disable_loading({commit}) {
      commit('DISABLE_LOADING')
    },
    widht_on_scroll({commit}, user_payload){
      commit('WIDTH_ON_SCROLL', user_payload)
    },
    height_on_scroll({commit}, user_payload){
      commit('HEIGHT_ON_SCROLL', user_payload)
    },
    height({commit}, user_payload){
      commit('HEIGHT', user_payload)
    },
    width({commit}, user_payload){
      commit('WIDTH', user_payload)
    }
  }
})
