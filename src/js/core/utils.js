import { ActiveRout } from "../Routing/ActiveRouter"

export function urlParse() {

  try {
    const currentURL = decodeURI(ActiveRout.urLHash)

    return currentURL
      .split('/+/')
      .slice(1, currentURL.length)
      .filter(elem => elem !== '')

  } catch (e) {
    alert('Ошибка URL')
  }

}

export function storage(key, value) {

  if (value) {
    localStorage.setItem(key, JSON.stringify(value))
    return
  }

  return JSON.parse(localStorage.getItem(key))
}