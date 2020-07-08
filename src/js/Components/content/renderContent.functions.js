import { urlParse } from "./content.functions"

export function titleSearch() {

  const URLParse = urlParse()
  let titleSearch = ''

  if (!URLParse.length) {
    titleSearch = ''
  }
  else if (URLParse.length === 2) {
    titleSearch = URLParse[0]
  }
  else if (URLParse.length === 1) {
    titleSearch = `Результат поиска: ${URLParse[0]}`
  }

  return titleSearch
}

export function errorSRT(base) {
  let errorSRT = !base.length
    ? errorSRT = 'По вашему запросу ничего не найдено'
    : ''

  return errorSRT
}
