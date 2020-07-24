import { urlParse } from "../../core/utils"
import { $ } from "../../core/Dom"

export function renderTitle() {

  const URLParse = urlParse()
  let titleSearch = ''

  if (!URLParse.length) {
    titleSearch = ''
  }
  else {
    titleSearch = `${URLParse[0]} - ${URLParse[1]}`
  }

  document.title = `
                    Поиск: ${URLParse[0]} - ${URLParse[1] || ''}.
                    Регард - сеть компьютерных магазинов
                  `

  return titleSearch
}

export function lackOfGoods(base,showItems, renderCardsTEST) {

  if (!base.length) {
    return 'По вашему запросу ничего не найдено'
  }
  else if (!showItems.length) {
    return 'Страницы не существует'
  }
  else if (renderCardsTEST === '') {
    return 'Товаров нет'
  }

  return ''
}

export function accardion(event, frag) {

  if (frag) {
    event.style.maxHeight = event.scrollHeight + 'px'
    event.setAttribute('data-accardion', true)
    $(event).qSelector('[data-plus]').innerHTML = '-'
    return
  }

  const { scrollHeight, style, dataset } = event
  const plus = $(event).qSelector('[data-plus]')

  if (JSON.parse(dataset.accardion)) {
    style.maxHeight = 26 + 'px'
    event.setAttribute('data-accardion', false)
    style.transition = 'max-height .2s easy'
    if (plus) {
      plus.innerHTML = '+'
    }
  }
  else {
    style.maxHeight = scrollHeight + 'px'
    event.setAttribute('data-accardion', true)

    if (plus) {
      plus.innerHTML = '-'
    }
  }
}