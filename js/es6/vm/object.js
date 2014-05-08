import { moment } from 'es5/moment'
import { AccessControlListVM } from 'es6/vm/acl'
import { SubscriptionsVM } from 'es6/vm/subscriptions'

export class ObjectVM {
  constructor(connection, url) {
    this.connection = connection
    this.url = url
    this.btime = null
    this.mtime = null
    this.owner = ''
    this.acl = null
    this.subscriptions = null
    this.attachment = null
    this.type = ''
    this.data = null
    this.children = null

    ko.track(this)
  }

  load() {
    this.connection.sendSelect(this.url).promise.then((response) => {
      var obj = response.body
      this.owner = obj.owner
      this.btime = moment(obj.btime)
      this.mtime = moment(obj.mtime)
      this.type = obj.type
      this.data = obj.data
      this.acl = new AccessControlListVM(obj.acl)
      this.subscriptions = new SubscriptionsVM(obj.subscriptions)
      this.children = new ChildrenVM()
    })
  }
}
