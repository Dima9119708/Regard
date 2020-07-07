import { $ } from "../../core/Dom"
import { searchHistory } from "../../core/redux/actions"

export class Search {

  constructor(content) {
    this.$root = content.$root
    this.DATA = content.DATA
    this.store = content.store
  }

  searchHistory() {

    const stor = this.store.getState().history

    if (stor && stor.length > 0) {

      const history = stor.map(item => {
        return `
          <div
            class="s-content__search-list-item-history"
            data-historyItem="historyItem">
            ${item}
          </div>
        `
      })

      history.push(`<button
                      data-historyClear="Clear"
                      class="s-content__search-list-item-history-clear">
                      Очистить историю
                    </button>`)

      return history.join('')
    }

    return ''
  }

  searchButton() {
    const searchList = this.$root.qSelector('[data-search-list-item]')
    const { searchListItem } = searchList.dataset

    if (JSON.parse(searchListItem)) {

      const { value } = this.$root.qSelector('[data-search]')
      this.store.dispath(searchHistory(value))

    }
  }

  eventClick(event) {

    const { searchbutton, historyclear, historyitem } = event.target.dataset
    const searchLIST = event.target.closest('[data-search-rel]')

    if (searchbutton) {
      this.searchButton()
    }
    else if (historyitem) {

      const searchInput = this.$root.qSelector('[data-search]')
      searchInput.value = event.target.innerHTML.trim()
      this.eventInput(searchInput)

    }
    else if (historyclear) {

      const parent = event.target.closest('[data-historyLi]')
      parent.innerHTML = ''
      parent.innerHTML = 'История поиска'
      this.store.dispath(searchHistory('clear'))

    }
    else if (searchLIST) {

      this.$root.qSelector('[data-search-list]').style.display = 'flex'

    }
    else {
      this.$root.qSelector('[data-search-list]').style.display = 'none'
    }
  }

  eventKeyBoard(event) {
    const { search } = event.target.dataset

    if (search) {
      this.$root.qSelector('[data-search-list]').style.display = 'flex'
    }

    if (search && event.key === 'Enter') {
      this.searchButton()
    }
  }

  eventInput(event) {

    const { value } = event.target || event

    const searchDATA = baseSearch(this.DATA, value)

    const listItem = this.$root.qSelector('[data-search-list-item]')

    if (!searchDATA.length) {
      listItem.setAttribute('data-search-list-item', false)

      return $(listItem)
                    .clear()
                    .insertHTML(
                      'beforeend',
                      'По вашему запросу ничего не найдено. Уточните свой запрос'
                    )
    }

    listItem.setAttribute('data-search-list-item', true)
    $(listItem).clear().insertHTML('beforeend', searchDATA.join(''))
  }
}


function baseSearch(DATA, value) {

  return DATA.reduce((acc, goods) => {

    value = value.toLowerCase().trim()

    if (value === '') {
      return []
    }
    else if (goods.name.toLowerCase().includes(value)) {

      if (acc.length > 10) {
        acc.splice(10, acc.length)
      }

      const str = `
        <a class="s-content__search-list-item-children" data-id="${goods.id}" href="#">
          <div class="s-content__search-list-item-children-image">
            <img src="./images/235789_600.png" alt="альтернативный текст">
          </div>

          <div class="s-content__search-list-item-children-inner">
            <div class="s-content__search-list-item-children-title">${goods.name}</div>
            <div class="s-content__search-list-item-children-price">${goods.price} руб.</div>
          </div>

        </a>
      `
      acc.push(str)
    }

    return acc
  }, [])
}