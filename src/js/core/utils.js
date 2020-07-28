import { ActiveRout } from "../Routing/ActiveRouter"
import { catalog } from "./urlHash.fn"

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

export function formatNumber(number) {
  return new Intl.NumberFormat('ru-RU').format(number)
}

export function storage(key, value) {

  if (value) {
    localStorage.setItem(key, JSON.stringify(value))
    return
  }

  return JSON.parse(localStorage.getItem(key))
}

export function searchMaxAndMinNumber(flag, array) {

  if (flag) {
    return array.reduce((acc, item) => Math.max(acc, +item.price), 0)
  }
  else {
    const allPrice = array.map(item => +item.price)
    return Math.min(...allPrice)
  }
}
