import User from '../../models/User'

export default {
  strict: true,
  namespaced: true,
  state: {
    managers: [],
    users: []
  },
  actions: {
    async fetchUsers (context) {
      const res = await fetch('http://cm.availability.ua/api/v1/users/list')
      const users = await res.json()
      context.commit('setUsers', users)
    }
  },
  mutations: {
    setUsers (state, users) {
      state.users = users.map(item => new User(item))
    }
  }
}
