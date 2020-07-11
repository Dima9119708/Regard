import { urlParse } from "./content.functions"

export function titleSearch() {

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

export function errorSRT(base,showItems, renderCardsTEST) {

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
