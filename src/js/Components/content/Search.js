import { $ } from "../../core/Dom"
import { searchHistory } from "../../core/redux/actions"
import { ActiveRout } from "../../Routing/ActiveRouter"
import { changeURLCalatog, catalogHashPath } from "../../core/urlHash.fn"

export class Search {

  constructor(content) {
    this.$root = content.$root
    this.DATA = content.DATA
    this.store = content.store
  }

  getHistorySearch() {

    const history = this.store.getState().history || []

    if (history && history.length > 0) {

      const story = history.map(item => {
        return `
          <div
            class="s-content__search-block-item-history"
            data-historyItem="historyItem"
            >
            ${item}
          </div>
        `
      })

      story.push(`<button
                      data-historyClear="Clear"
                      class="s-content__search-block-item-history-clear">
                      Очистить историю
                    </button>`)

      return story.join('')
    }

    return ''
  }

  productSearchButton() {
    const searchList = this.$root.qSelector('[data-search-list-item]')

    if (searchList) {

      const { searchListItem } = searchList.dataset

      if (JSON.parse(searchListItem)) {

        const { value } = this.$root.qSelector('[data-search]')

        const history = this.store.getState().history || []

        if (!history.includes(value)) {
          this.store.dispath(searchHistory(value))
        }

        const hash = changeURLCalatog(value, catalogHashPath.search)
        ActiveRout.setHash(hash)
      }
    }
  }

  createAndAppendSearchList() {
    const searchList = this.$root.qSelector('[data-search-list]')

    if (!searchList) {
      const parent = this.$root.qSelector('[data-search-rel]')
      const node = createSearchList(this.getHistorySearch.bind(this))
      parent.append(node)

      const search = this.$root.qSelector('[data-search]')

      if (search.value) {
        this.onInput(search)
      }
    }
  }

  onClick(event) {

    const { searchbutton, historyclear, historyitem } = event.target.dataset
    const searchInput = event.target.closest('[data-search-rel]')

    if (searchbutton) {
      this.productSearchButton()
    }
    else if (historyitem) {

      const searchInput = this.$root.qSelector('[data-search]')
      searchInput.value = event.target.innerHTML.trim()
      this.onInput(searchInput)
    }
    else if (historyclear) {

      const parent = event.target.closest('[data-historyLi]')
      parent.innerHTML = ''
      parent.innerHTML = 'История поиска'
      this.store.dispath(searchHistory('clear'))

    }
    else if (searchInput) {
      this.createAndAppendSearchList()
    }
    else {

      const searchList = this.$root.qSelector('[data-search-list]')

      if (searchList) {
        searchList.remove()
      }
    }
  }

  onKeyBoard(event) {
    const { search } = event.target.dataset

    if (search) {
      this.createAndAppendSearchList()
    }

    if (search && event.key === 'Enter') {
      this.productSearchButton()
    }
  }

  onInput(event) {

    const target = event.target || event
    const { search } = target.dataset

    if (search) {

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
}

function createSearchList(getHistorySearch) {
  const searchLi = $.create('div', 's-content__search-block')
  searchLi.setAttribute('data-search-list','search-list')
  searchLi.innerHTML = `
    <div class="s-content__search-block-item" data-historyLi>
        История поиска
        ${getHistorySearch()}
      </div>
      <div class="s-content__search-block-item" data-search-list-item="false">
        Введите модель в поиск
    </div>
  `
  return searchLi
}

function baseSearch(DATA, value) {

  return DATA.reduce((acc, goods) => {

    const val = new RegExp(value, 'gi')

    if (value === '') {
      return []
    }
    else if (
        goods.name.match(val)
        ||
        goods.name.includes(value)
      ) {

      if (acc.length > 10) {
        acc.splice(10, acc.length)
      }

      const str = `
        <a class="s-content__search-block-item-list" data-id="${goods.id}" href="#">
          <div class="s-content__search-block-item-list-image">
            <img src="./images/235789_600.png" alt="альтернативный текст">
          </div>

          <div class="s-content__search-block-item-list-inner">
            <div class="s-content__search-block-item-list-title">${goods.name}</div>
            <div class="s-content__search-block-item-list-price">${goods.price} руб.</div>
          </div>

        </a>
      `
      acc.push(str)
    }

    return acc
  }, [])
}