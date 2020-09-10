const colors = ['green darken-2', 'purple', 'orange']

export default class Request {
  constructor (data) {
    this.id = Number(data.id)
    this.userId = Number(data.user_id)
    this.dateFrom = String(data.date_from.split('T')[0])
    this.dateTo = String(data.date_to.split('T')[0])
    this.timeFrom = String(data.time_from || '00:00')
    this.timeTo = String(data.time_to || '00:00')
    this.description = String(data.description)
    this.typeId = Number(data.type_id)
    this.color = String(colors[data.type_id - 1])
    this.typeRequest = String(
      data.RequestType.slug[0].toUpperCase() +
      data.RequestType.slug.slice(1)
    )
    this.needApproval = Boolean(data.RequestType.need_approval)
    this.timePeriod = Boolean(data.RequestType.time_period)
    if (data.User) {
      this.userName = String(data.User.username)
    }
    if (data.Approvals && data.Approvals.length > 0) {
      this.requestId = Number(data.Approvals[0].request_id)
      this.approverId = Number(data.Approvals[0].approver_id)
      this.status = String(data.Approvals[0].status)
      this.descriptionApproval = String(data.Approvals[0].description)
    }
  }
}
