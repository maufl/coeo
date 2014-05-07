import { Client } from 'es6/fosp/client'

export class ClientViewModel extends Client {
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
      this.connection.sendConnect({}, {version: '0.1'}).promise
    }).then(() => {
      this.connection.sendAuthenticate({}, {name: userName, password: this.password}).promise
    }).then(() => {
      this.currentTree = this.user
      console.log('Loged in!')
    }).catch((err) => {
      console.error(err)
    })
  }

  select(tree) {
    if (tree instanceof String) {
      this.currentTree = tree
    }
  }
}
