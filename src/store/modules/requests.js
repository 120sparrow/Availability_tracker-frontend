import Request from '../../models/Request'
import RequestType from '../../models/RequestType'

export default {
  strict: true,
  namespaced: true,
  state: {
    requests: [],
    myRequests: [],
    request: null,
    requestType: [],
    requestNeedApproval: [],
    requestsByDate: []
  },
  actions: {
    createRequest (context, data) {
      return fetch(
        'http://cm.availability.ua/api/v1/request', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }
      )
        .catch(err => console.error(err))
    },
    async fetchRequests (context) {
      const res = await fetch('http://cm.availability.ua/api/v1/request')
      const requests = await res.json()
      context.commit('setRequests', requests)
    },
    async fetchMyRequests (context) {
      const res = await fetch('http://cm.availability.ua/api/v1/request/my_requests')
      const myRequests = await res.json()
      context.commit('setMyRequests', myRequests)
    },
    async fetchRequestById (context, id) {
      context.commit('clearRequest', null)
      const res = await fetch('http://cm.availability.ua/api/v1/request/' + id)
      const request = await res.json()
      context.commit('setRequestById', request)
    },
    async editRequest (context, { requestId, data }) {
      const res = await fetch(
        'http://cm.availability.ua/api/v1/request/' + requestId, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }
      )
      return res
    },
    async deleteRequest (context, requestId) {
      const res = await fetch(
        'http://cm.availability.ua/api/v1/request/' + requestId, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      )
      return res
    },
    async fetchRequestType (context) {
      const res = await fetch('http://cm.availability.ua/api/v1/request/type')
      const requestType = await res.json()
      context.commit('setRequestType', requestType)
    },
    async fetchRequestNeedApproval (context) {
      const res = await fetch('http://cm.availability.ua/api/v1/request/need_approval')
      const requestNeedApproval = await res.json()
      context.commit('setRequestNeedApproval', requestNeedApproval)
    },
    async fetchRequestsByDate (context, date) {
      const res = await fetch(`http://cm.availability.ua/api/v1/request/${date.year}/${date.month}`)
      const requestsByDate = await res.json()
      context.commit('setRequestsByDate', requestsByDate)
    }
  },
  mutations: {
    setRequests (state, requests) {
      state.requests = requests.map(item => new Request(item))
    },
    setMyRequests (state, myRequests) {
      state.myRequests = myRequests.map(item => new Request(item))
    },
    setRequestById (state, request) {
      state.request = new Request(request)
    },
    clearRequest (state, request) {
      state.request = request
    },
    setRequestType (state, requestType) {
      state.requestType = requestType.map(item => new RequestType(item))
    },
    setRequestNeedApproval (state, requestNeedApproval) {
      state.requestNeedApproval = requestNeedApproval.map(item => new Request(item))
    },
    setRequestsByDate (state, requestsByDate) {
      state.requestsByDate = requestsByDate.map(item => new Request(item))
    }
  }
}
