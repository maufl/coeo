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

  contains(buddy) {
    var ID = buddy
    if (buddy instanceof BuddyVM) {
      ID = buddy.ID
    }
    for (var i=0; i< this.length; i++) {
      if (this[i].ID === ID) {
        return true
      }
    }
    return false
  }

  add(buddy) {
    if (typeof buddy === 'string') {
      var ID = buddy
    } else if (buddy instanceof BuddyVM) {
      var ID = buddy.ID
    } else {
      return
    }
    if (this.contains(ID) || this.client.user === ID) {
      return
    }
    var update = { data: {} }
    update.data[ID] = { }
    this.client.connection.sendUpdate(this.client.user + "/config/buddies", {}, update).promise.then(() => {
      this.push(buddy)
    })
    this.client.connection.sendSelect(this.client.user + "/config/groups", {}, {}).promise.then((resp) => {
      var buddyList = resp.body.data || {}
      var friendList = { "friends": buddyList["friends"] || [] }
      friendList["friends"].push(ID)
      this.client.connection.sendUpdate(this.client.user + "/config/groups", {}, { data: friendList })
    })
  }
}
