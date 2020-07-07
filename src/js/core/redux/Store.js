import { __INIT__ } from "./constans"

export class Store {
  constructor(reducer, initialState = {}) {
    this.reducer = reducer
    this.state = this.reducer({ ...initialState }, { type: __INIT__})
    this.listeners = []
  }

  dispath(action) {
    this.state = this.reducer(this.state, action)
    this.listeners.forEach(listener => listener(this.state))
  }

  subscribe(fn) {
    this.listeners.push(fn)
  }

  getState() {
    return this.state
  }
}