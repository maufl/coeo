import { BuddyVM } from 'es6/vm/buddy'

export class BuddyListVM extends Array {
  constructor(client) {
    this.client = client
    ko.track(this)
  }

  load() {
    this.client.connection.sendSelect(this.client.user + "/config/buddies").promise.then((response) => {
      var buddies = response.body.data || {}
      for (var ID in buddies) {
        var buddy = new BuddyVM(this.client, ID)
        buddy.name = buddies[ID].name
        buddy.load()
        this.push(buddy)
      }
    })
  }
}
