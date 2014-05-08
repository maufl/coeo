import { Client } from 'es6/fosp/client'

export class ClientVM extends Client {
  constructor() {
    super()
    this.user = ''
    this.password = ''
    this.passwordConfirmation = ''
    this.register = false
    this.insecure = false
    this.currentTree = ''
    this.buddies = []

    ko.track(this)
  }

  connect() {
    if (this.user == '' || this.password == '') {
      return;
    }
    var [userName, domainName] = this.user.split('@');
    this.host = domainName;
    this.openConnection().then(() => {
      var req = this.connection.sendConnect({}, {version: '0.1'})
      return req.promise
    }).then((response) => {
      return this.connection.sendAuthenticate({}, {name: userName, password: this.password}).promise
    }).then((response) => {
      this.currentTree = this.user
    }).catch((err) => {
      console.log("Login failed")
      console.error(err)
    })
  }

  signup() {
    if (this.user == '' || this.password == '' || this.password != this.passwordConfirmation) {
      return;
    }
    var [userName, domainName] = this.user.split('@');
    this.host = domainName;
    this.openConnection().then(() => {
      return this.connection.sendConnect({}, {version: '0.1'}).promise
    }).then(() => {
      return this.connection.sendRegister({}, {name: userName, password: this.password}).promise
    }).then(() => {
      return this.connection.sendAuthenticate({}, {name: userName, password: this.password}).promise
    }).then(() => {
      this.currentTree = this.user
    }).catch((err) => {
      console.log("Sign up failed")
      console.log(err)
    })
  }

  select(tree) {
    if (tree instanceof String) {
      this.currentTree = tree
    }
  }
}
