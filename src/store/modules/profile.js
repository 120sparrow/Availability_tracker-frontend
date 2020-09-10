import User from '../../models/User'

export default {
  strict: true,
  namespaced: true,
  state: {
    user: null
  },
  actions: {
    async fetchUser (context) {
      const res = await fetch('http://cm.availability.ua/api/v1/users/profile')
      const user = await res.json()
      context.commit('setUser', user)
    }
  },
  mutations: {
    setUser (state, user) {
      state.user = new User(user)
    }
  }
}
