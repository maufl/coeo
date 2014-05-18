import { ClientVM } from 'es6/vm/client';

export class App {
  constructor() {
    this.client = new ClientVM();
    this.notification = null

    window.app = this

    ko.track(this)
  }

}
