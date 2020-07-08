import { $ } from "../../core/Dom"
import { searchHistory } from "../../core/redux/actions"
import { ActiveRout } from "../../Routing/ActiveRouter"
import { calatogFN } from "../../core/urlHash.fn"

export class Search {

  constructor(content) {
    this.$root = content.$root
    this.DATA = content.DATA
    this.store = content.store
  }

  getHistory() {

    const { history } = this.store.getState()

    if (history && history.length > 0) {

      const story = history.map(item => {
        return `
          <div
            class="s-content__search-list-item-history"
            data-historyItem="historyItem"
            >
            ${item}
          </div>
        `
      })

      story.push(`<button
                      data-historyClear="Clear"
                      class="s-content__search-list-item-history-clear">
                      Очистить историю
                    </button>`)

      return story.join('')
    }

    return ''
  }

  searchButton() {
    const searchList = this.$root.qSelector('[data-search-list-item]')

    if (searchList) {

      const { searchListItem } = searchList.dataset

      if (JSON.parse(searchListItem)) {

        const { value } = this.$root.qSelector('[data-search]')
        this.store.dispath(searchHistory(value))

        const hash = calatogFN(value, '')
        ActiveRout.setHash(hash)
      }
    }
  }

  appendSearchList() {
    const searchList = this.$root.qSelector('[data-search-list]')

    if (!searchList) {
      const parent = this.$root.qSelector('[data-search-rel]')
      const node = createSearchList(this.getHistory.bind(this))
      parent.append(node)

      const search = this.$root.qSelector('[data-search]')

      if (search.value) {
        this.eventInput(search)
      }
    }
  }

  eventClick(event) {

    const { searchbutton, historyclear, historyitem } = event.target.dataset
    const searchInput = event.target.closest('[data-search-rel]')

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
    else if (searchInput) {
      this.appendSearchList()
    }
    else {

      const searchList = this.$root.qSelector('[data-search-list]')

      if (searchList) {
        searchList.remove()
      }
    }
  }

  eventKeyBoard(event) {
    const { search } = event.target.dataset

    if (search) {
      this.appendSearchList()
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

function createSearchList(getHistory) {
  const searchLi = $.create('div', 's-content__search-list')
  searchLi.setAttribute('data-search-list','search-list')
  searchLi.innerHTML = `
    <div class="s-content__search-list-item" data-historyLi>
        История поиска
        ${getHistory()}
      </div>
      <div class="s-content__search-list-item" data-search-list-item="false">
        Введите модель в поиск
    </div>
  `
  return searchLi
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