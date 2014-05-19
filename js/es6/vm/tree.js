import { ChannelVM } from './channel'

var defaultAvatar = new Image();
defaultAvatar.src = window.location + '/images/defaultAvatar.png';

export class TreeVM {
  constructor(client, ID) {
    this.ID = ID
    this.name = ''
    this.avatar = defaultAvatar
    this.client = client

    this.defaultChannel = new ChannelVM(this.client, this.ID + '/social/channels/default')

    ko.track(this)
  }

  displayName() {
    return this.name === '' ? this.ID : this.name
  }

  isMe() {
    return false
  }

  isBuddy() {
    return false
  }

  load() {
    this.loadName()
    this.loadAvatar()
  }

  loadName() {
    this.client.connection.sendSelect(this.ID + "/social/me").promise.then((response) => {
      if (this.name === '' || typeof this.name === 'undefined') {
        this.name = response.body.data.name
      }
    })
  }

  loadAvatar() {
    this.client.connection.sendSelect(this.ID + "/social/me/avatar").promise.then((response) => {
      var attachment = response.body.attachment || {}
      if (attachment.type !== '') {
        this.client.connection.sendRead(this.ID + "/social/me/avatar").promise.then((response) => {
          var blob = new Blob([response.body], {type: attachment.type})
          var img = new Image()
          img.src = URL.createObjectURL(blob)
          this.avatar = img
        }).catch((err) => {
          console.log("Error when loading avatar of " + this.ID)
          console.error(err)
        })
      }
    })
  }
}
