export default class RequestType {
  constructor (data) {
    this.slug = String(data.slug[0].toUpperCase() + data.slug.slice(1))
    this.needApproval = Boolean(data.need_approval)
    this.timePeriod = Boolean(data.time_period)
  }
}
