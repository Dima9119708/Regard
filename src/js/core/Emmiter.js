export class Emmiter {
  constructor () {
    this.listeners = {}
  }

  emit(event, data) {
    this.listeners[event].forEach(listener => {
      listener(data)
    });
  }

  subscribe(event,fn) {
    this.listeners[event] = []
    this.listeners[event].push(fn)
  }
}
