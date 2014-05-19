import moment form 'es5/moment.min'

export class PostVM {
  constructor(client, channel, url) {
    this.client = client
    this.channel = channel
    this.url = url
    this.owner = null
    this.btime = null
    this.mtime = null
    this.text = ''

    ko.track(this)
  }

  load(url) {
    if (typeof url === 'string') {
      this.url = url
    }
    if (typeof this.url !== 'string') {
      return
    }
    this.client.connection.sendSelect(this.url).promise.then((resp) => {
      var B = resp.body
      this.btime = moment(B.btime)
      this.mtime = moment(B.mtime)
      this.owner = B.owner
      this.text = B.data
    })
  }

  create() {
    if (typeof this.url === 'string') {
      return
    }
    this.url = this.channel.url + '/post-' + moment().format('YYYY-MM-DD-hh:mm:ss')
    this.client.connection.sendCreate(this.url, {}, { data: this.text }).promise.then(() => {
      this.channel.load()
      this.text = ''
    })
  }

}
