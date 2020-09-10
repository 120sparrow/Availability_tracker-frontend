export default {
  strict: true,
  namespaced: true,
  state: {
    isUserLoggedIn: false
  },
  actions: {
    async isSessionExist (context) {
      const res = await fetch('http://cm.availability.ua/api/v1/users/profile')
      const profile = await res.json()

      context.commit('changeIsUserLoggedInState', !!profile)
    }
  },
  mutations: {
    changeIsUserLoggedInState (state, profile) {
      state.isUserLoggedIn = profile
    }
  }
}
