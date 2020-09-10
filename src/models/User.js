export default class User {
  constructor (data) {
    if (data) {
      this.id = Number(data.id)
      this.firstName = String(data.first_name)
      this.lastName = String(data.last_name)
      this.userName = String(data.username)
      this.email = String(data.email)
      this.isManager = Boolean(data.isManager)
    }
  }
}
