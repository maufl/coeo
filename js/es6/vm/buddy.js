import { TreeVM } from './tree'

export class BuddyVM extends TreeVM {
  constructor(client, ID) {
    super(client, ID)
  }

  isBuddy() {
    return true
  }

}
