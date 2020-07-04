import { storage } from "../../core/storage"
import { $ } from "../../core/Dom"

export class Search {

  constructor($root, data) {
    this.$root = $root
    this.DATA = data
  }

  searchHistory() {

    const stor = storage('search-History')

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

  eventClick(event) {

    const { searchbutton, historyclear, historyitem } = event.target.dataset
    const searchLIST = event.target.closest('[data-search-rel]')

    if (searchbutton) {

      const searchList = this.$root.qSelector('[data-search-list-item]')
      const { searchListItem } = searchList.dataset

      if (JSON.parse(searchListItem)) {
        const { value } = this.$root.qSelector('[data-search]')

        const arrayHistory = storage('search-History') || []
        arrayHistory.push(value)

        storage('search-History', arrayHistory)
      }

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
      storage('search-History', [])

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
  }

  eventInput(event) {

    const { value } = event.target || event

    const searchDATA = searchInput(this.DATA, value)

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


function searchInput(DATA, value) {
  return DATA.reduce((acc, goods) => {

    if (value.toLowerCase() === '') {
      return []
    }
    else if (goods.name.toLowerCase().includes(value.toLowerCase())) {

      if (acc.length > 10) {
        acc.splice(10, acc.length)
      }

      const str = `
        <a class="s-content__search-list-item-children" href="#">
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