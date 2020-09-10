import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import profile from './modules/profile'
import requests from './modules/requests'
import approval from './modules/approval'
import users from './modules/users'

Vue.use(Vuex)

export default new Vuex.Store({
  namespaced: true,
  strict: true,
  modules: {
    auth,
    profile,
    requests,
    approval,
    users
  }
})
