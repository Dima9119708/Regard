export class ActiveRout {


  static get urLHash() {
    return location.hash.slice(1).trim()
  }

  static setHash(hash) {
    location.hash = hash
    location.reload()
  }
}