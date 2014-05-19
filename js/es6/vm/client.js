import { Client } from 'es6/fosp/client'
import { BuddyListVM } from 'es6/vm/buddy-list'
import { BuddyVM } from './buddy'
import { TreeVM } from './tree'
import { MeVM } from './me'
import { notify } from './notify'

export class ClientVM extends Client {
  constructor() {
    super()
    this.user = ''
    this.me = null
    this.userName = ''
    this.password = ''
    this.passwordConfirmation = ''
    this.register = false
    this.insecure = false
    this.currentTree = null
    this.buddyList = new BuddyListVM(this)
    this.searchText = ''
    this.loading = false

    ko.track(this)
  }

  connect() {
    if (this.user == '' || this.password == '') {
      return;
    }
    [this.userName, this.host] = this.user.split('@');
    return this.openConnection().then(() => {
      ko.track(this.connection)
      ko.getObservable(this.connection, 'pendingRequestNumber').subscribe((newValue) => {
        if (newValue > 0) {
          this.loading = true
        } else {
          this.loading = false
        }
      })
      return this.connection.sendConnect({}, {version: '0.1'}).promise
    }).catch((err) => {
      notify("Failed to open connection to " + this.host + ".")
    })
  }

  authenticate() {
    return this.connection.sendAuthenticate({}, {name: this.userName, password: this.password}).promise
  }

  login() {
    this.connect().then(() => {
      this.authenticate().then(() => {
        this.postLogin()
      }).catch((err) => {
        console.error(err)
        notify("Login failed. Is the user and the password correct?")
      })
    })
  }

  signup() {
    this.connect().then(() => {
      this.connection.sendRegister({}, {name: this.userName, password: this.password}).promise.then(() => {
        this.authenticate().then(() => {
          this.postLogin()
        })
      }).catch((err) => {
        console.log(err)
        notify("Sign up failed.")
      })
    })
  }

  postLogin() {
    this.me = new MeVM(this, this.user)
    this.me.load()
    this.select(this.me)
    this.setupProfile()
    this.setupBuddiesGroups()
    this.setupChannel()
    this.buddyList.load()
  }

  select(tree) {
    if (tree instanceof TreeVM) {
      this.currentTree = tree
      tree.defaultChannel.load()
    }
  }

  search() {
    if (this.connection === null) {
      return
    }
    if (this.searchText === this.user) {
      this.select(this.me)
      return
    }
    this.connection.sendSelect(this.searchText + "/social/me").promise.then(() => {
      var newBuddy = new BuddyVM(this, this.searchText)
      newBuddy.load()
      this.currentTree = newBuddy
    }).catch((err) => {
      notify("Could not find user " + this.searchText + " or insufficent rights")
    })
  }

  setupProfile() {
    var createMe = () => { return this.connection.sendCreate(this.user + "/social/me", {}, { acl: { others: ['data-read', 'children-read', 'attachment-read', 'subscriptions-write']}, data: { name: this.user } }).promise }
    var createAvatar = () => { return this.connection.sendCreate(this.user + "/social/me/avatar", {}, {}).promise }
    var createSocial = () => { return this.connection.sendCreate(this.user + "/social", {}, {}).promise }
    this.objectExists(this.user + "/social/me/avatar").catch((err) => {
      createSocial().then(createMe,createMe).then(createAvatar,createAvatar)
    })
  }

  setupBuddiesGroups() {
    var createConfig = () => { return this.connection.sendCreate(this.user + "/config", {}, {}).promise }
    var createBuddies = () => { return this.connection.sendCreate(this.user + "/config/buddies", {}, {}).promise }
    var createGroups = () => { return this.connection.sendCreate(this.user + "/config/groups", {}, {}).promise }
    this.objectExists(this.user + "/config/buddies").catch(() => {
      createConfig().then(createGroups,createGroups).then(createBuddies,createBuddies)
    })
  }

  setupChannel() {
    var createChannels = () => { return this.connection.sendCreate(this.user + "/social/channels", {}, {}).promise }
    var createDefaultChannel = () => { return this.connection.sendCreate(this.user + "/social/channels/default", {}, { acl: { groups: { friends: ['data-read', 'children-read', 'attachment-read', 'subscriptions-write'] }}}).promise }
    this.objectExists(this.user + "/social/channels/default").catch((err) => {
      createChannels().then(createDefaultChannel, createDefaultChannel)
    })
  }

  objectExists(path) {
    return this.connection.sendSelect(path).promise
  }
}
