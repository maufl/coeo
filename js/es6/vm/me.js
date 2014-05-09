import { TreeVM } from './tree'

export class MeVM extends TreeVM {
  constructor(client, ID) {
    super(client, ID)
  }

  isMe() {
    return true
  }

  uploadAvatar(e) {
    var files = e && e.originalEvent && e.originalEvent.dataTransfer && e.originalEvent.dataTransfer.files
    console.log(files)
    if (files instanceof FileList && files.length === 1) {
      var file = files[0]
      var reader = new FileReader();
      reader.onload = () => {
        this.client.connection.sendUpdate(this.ID + "/social/me/avatar", {}, { attachment: { name: file.name, type: file.type }}).promise.then(() => {
          return this.client.connection.sendWrite(this.ID + "/social/me/avatar", {}, reader.result).promise
        }).then(() => {
          this.loadAvatar()
        }).catch((err) => {
          console.error("Failed to upload avatar")
          console.error(err)
        })
      }
      reader.readAsArrayBuffer(file)
    }
  }

  updateName(name) {
    this.name = name
    this.client.connection.sendUpdate(this.ID + "/social/me", {}, { data: { name: name } }).promise.catch(() => {
      this.loadName()
    })
  }
}
