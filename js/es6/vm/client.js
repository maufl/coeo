import { Client } from 'es6/fosp/client'

export class ClientVM extends Client {
  constructor() {
    super()
    this.user = ''
    this.password = ''
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
    console.log(this)
    this.openConnection().then(() => {
      var req = this.connection.sendConnect({}, {version: '0.1'})
      return req.promise
    }).then((response) => {
      console.log(response.short())
      return this.connection.sendAuthenticate({}, {name: userName, password: this.password}).promise
    }).then((response) => {
      console.log(response.short())
      this.currentTree = this.user
      console.log('Loged in!')
    }).catch((err) => {
      console.log("Login failed")
      console.error(err)
    })
  }

  select(tree) {
    if (tree instanceof String) {
      this.currentTree = tree
    }
  }
}
