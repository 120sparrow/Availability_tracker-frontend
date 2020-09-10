export default {
  strict: true,
  namespaced: true,
  state: {
    approvals: [],
    approval: null
  },
  actions: {
    createApproval (context, data) {
      return fetch(
        `http://availability.ua/api/v1/request/${data.requestId}/approval`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        .catch(err => console.error(err))
    },
    async updateApproval (context, { approvalId, data }) {
      const res = await fetch(
        'http://availability.ua/api/v1/request/approval/' + approvalId, {
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
    async fetchApprovals (context) {
      const res = await fetch('http://cm.availability.ua/api/v1/request/approval')
      const approvals = await res.json()
      context.commit('setApprovals', approvals)
    },
    async fetchApprovalById (context, requestId) {
      const res = await fetch(`http://cm.availability.ua/api/v1/request/${requestId}/approval`)
      const approval = await res.json()
      context.commit('setApprovalById', approval)
    },
    async deleteApproval (context, approvalId) {
      const res = await fetch(
        'http://cm.availability.ua/api/v1/request/approval/' + approvalId, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      )
      return res
    }
  },
  mutations: {
    setApprovals (state, approvals) {
      state.approvals = approvals
    },
    setApprovalById (state, approval) {
      state.approval = approval
    }
  }
}
