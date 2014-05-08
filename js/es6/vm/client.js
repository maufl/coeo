import { Client } from 'es6/fosp/client'
import { BuddyListVM } from 'es6/vm/buddy-list'

export class ClientVM extends Client {
  constructor() {
    super()
    this.user = ''
    this.userName = ''
    this.password = ''
    this.passwordConfirmation = ''
    this.register = false
    this.insecure = false
    this.currentTree = ''
    this.buddyList = new BuddyListVM(this)

    ko.track(this)
  }

  connect() {
    if (this.user == '' || this.password == '') {
      return;
    }
    [this.userName, this.host] = this.user.split('@');
    return this.openConnection().then(() => {
      return this.connection.sendConnect({}, {version: '0.1'}).promise
    })
  }

  authenticate() {
    return this.connection.sendAuthenticate({}, {name: this.userName, password: this.password}).promise
  }

  login() {
    this.connect().then(this.authenticate.bind(this)).then(this.postLogin.bind(this)).catch((err) => {
      console.log("Login failed")
      console.error(err)
    })
  }

  signup() {
    this.connect().then(() => {
      return this.connection.sendRegister({}, {name: this.userName, password: this.password}).promise
    }).then(this.authenticate.bind(this)).then(this.postLogin.bind(this)).catch((err) => {
      console.log("Sign up failed")
      console.log(err)
    })
  }

  postLogin() {
    this.currentTree = this.user
    this.setupProfile()
    this.setupBuddiesGroups()
    this.buddyList.load()
  }

  select(tree) {
    if (typeof tree === "string") {
      this.currentTree = tree
    }
  }

  setupProfile() {
    var createMe = () => { return this.connection.sendCreate(this.user + "/social/me", {}, { data: { name: this.user } }).promise }
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

  objectExists(path) {
    return this.connection.sendSelect(path).promise
  }
}
