import { PostVM } from './post'
import { notify } from './notify'

var comparePosts = (a,b) => {
  return a.mtime > b.mtime
}

export class ChannelVM extends Array {
  constructor(client, url) {
    this.client = client
    this.url = url
    this.newPost = new PostVM(this.client, this)
    this.loadedPosts = []

    ko.track(this, ['newPost', 'loadedPosts'])
  }

  load() {
    this.client.connection.sendList(this.url).promise.then((resp) => {
      var posts = resp.body
      console.log(posts)
      for (var i=0; i<posts.length; i++) {
        console.log(posts[i])
        if (this.loadedPosts.indexOf(posts[i]) >= 0) {
          continue
        }
        var p = new PostVM(this.client, this, this.url+'/'+posts[i])
        p.load()
        this.push(p)
        this.loadedPosts.push(posts[i])
      }
      this.sort(comparePosts)
    }).catch((err) => {
      console.log(err)
      notify("Could not fetch posts")
    })
  }

  removePost(post) {
    if (! post instanceof PostVM) {
      return
    }
    this.client.connection.sendDelete(post.url).promise.then(() => {
      var index = this.indexOf(post)
      if (index >= 0) {
        this.splice(index, 1)
      }
    })
  }

}
