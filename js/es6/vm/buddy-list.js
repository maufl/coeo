
export class BuddyListVM extends Array {
  constructor(client) {
    this.client = client
    ko.track(this)
  }

  load() {
    this.client.connection.sendSelect(this.client.user + "/config/buddies").promise.then((response) => {
      var buddies = response.body.data || {}
      for (var ID in buddies) {
        var buddy = buddies[ID]
        buddy.ID = ID
        this.push(buddy)
      }
    })
  }
}
