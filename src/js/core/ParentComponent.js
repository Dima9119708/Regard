import { DomListener } from "./DomListener";

export class ParentComponent extends DomListener {

  constructor($root, options) {
    super($root, options || {})
  }


  init() {
    super.listener()
  }

  destroy() {
    super.destroy()
  }
}