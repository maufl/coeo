import { TreeVM } from './tree'

export class MeVM extends TreeVM {
  constructor(client, ID) {
    super(client, ID)
  }

  isMe() {
    return true
  }
}
