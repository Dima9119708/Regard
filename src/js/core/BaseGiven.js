export class BaseGiven {
  constructor() {
    this.DATA = null
  }

  getDATA(base) {
    this.DATA = base
  }

  returnData() {
    return this.DATA
  }
}