import { DomListener } from "./DomListener";

export class ParentComponent extends DomListener {

  constructor($root, options) {
    super($root, options || {})

    this.store = options.store
    this.DATA = options.DATA
    this.emmiter = options.emmiter
    this.user = options.user

    this.prepare()
  }

  prepare() {}

  init() {
    super.listener()
  }

  destroy() {
    super.destroy()
  }
}