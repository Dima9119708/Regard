import { urlParse } from "./content.functions"

export function titleSearch() {

  const URLParse = urlParse()
  let titleSearch = ''

  if (!URLParse.length) {
    titleSearch = ''
  }
  else {

    const urtParam2 = URLParse[1] ? `- ${URLParse[1]}` : ''

    titleSearch = `Результат поиска: ${URLParse[0]} ${urtParam2}`
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
