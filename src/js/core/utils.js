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

export function ratingСalc() {

  let count = 0

  return (obj) => {

    const calcOfTheOverallRating = Object.keys(obj)
        .map(item => obj[item].overallAssessment )
        .filter(item => item)

    return  calcOfTheOverallRating.reduce((acc, item) => {
      count += item
      acc = count / calcOfTheOverallRating.length

      return acc
    }, 0).toFixed(1)
  }
}

export function searchItemID(DATA, id) {
  return DATA.find(item => +item.id === +id )
}