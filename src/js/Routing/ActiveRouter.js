export class ActiveRout {


  static get urLHash() {
    return location.hash.slice(1).trim()
  }

  static hash(hash) {
    location.hash = hash
  }

  static setHash(hash) {
    location.hash = hash
  }

  static reloadPage() {
    location.reload()
  }
}