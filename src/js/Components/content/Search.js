import { $ } from "../../core/Dom"
import { searchHistory } from "../../core/redux/actions"
import { ActiveRout } from "../../Routing/ActiveRouter"
import { changeURLCalatog, catalogHashPath } from "../../core/urlHash.fn"

export class Search {

  constructor(content) {
    this.content = content
    this.$root = content.$root
    this.DATA = content.DATA
    this.store = content.store
  }

  get DOM() {
    return {
      searchParent: this.$root.qSelector('[data-search-rel]'),
      searchListParent: this.$root.qSelector('[data-search-list]'),
      searchList: this.$root.qSelector('[data-search-list-item]'),
      searchInput: this.$root.qSelector('[data-search]')
    }
  }

  renderHTML() {
    return `
      <section class="s-content__search">
          <div class="s-content__search-rel" data-search-rel>
            <input class="s-content__input" type="text" data-search="search" placeholder="Поиск среди ${this.DATA.length} товаров">
          </div>
          <button class="s-content__find" data-searchButton="search" type="search">Найти</button>
      </section>
    `
  }

  #getHistorySearch() {

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

  #productSearchButton() {

    const searchList = this.DOM.searchList || this.$root.qSelector('[data-search-list-item]')

    if (searchList) {

      const { searchListItem } = searchList.dataset

      if (JSON.parse(searchListItem)) {

        const { value } = this.DOM.searchInput

        const history = this.store.getState().history || []

        if (!history.includes(value)) {
          this.store.dispath(searchHistory(value))
        }

        const hash = changeURLCalatog(value, catalogHashPath.search)
        ActiveRout.setHash(hash)

        this.deleteList()
        this.content.reRenderHTML()
      }
    }
  }

  #createAndAppendSearchList() {
    const searchList = this.DOM.searchListParent

    if (!searchList) {
      const node = createSearchList(this.#getHistorySearch.bind(this))
      this.DOM.searchParent.append(node)

      if (this.DOM.searchInput.value) {
        this.onInput(this.DOM.searchInput)
      }
    }
  }

  onClick(event) {

    const { searchbutton, historyclear, historyitem } = event.target.dataset
    const searchInput = event.target.closest('[data-search-rel]')
    const cardID = event.target.closest('[data-id]')

    if (searchbutton) {
      this.#productSearchButton()
    }
    else if (historyitem) {
      this.DOM.searchInput.value = event.target.innerHTML.trim()
      this.onInput(this.DOM.searchInput)
    }
    else if (historyclear) {

      const parent = event.target.closest('[data-historyLi]')
      parent.innerHTML = ''
      parent.innerHTML = 'История поиска'
      this.store.dispath(searchHistory('clear'))

    }
    else if (searchInput) {
      this.#createAndAppendSearchList()
    }
    else {

      const searchList = this.DOM.searchListParent

      if (searchList) {
        searchList.remove()
      }
    }

    if (cardID) {
      this.deleteList()
    }
  }

  onKeyBoard(event) {
    const { search } = event.target.dataset

    if (search) {
      this.#createAndAppendSearchList()
    }

    if (search && event.key === 'Enter') {
      this.#productSearchButton()
    }
  }

  async onInput(event) {

    const target = event.target || event
    const { search } = target.dataset

    if (search) {

      const { value } = event.target || event

      const listItem = this.DOM.searchList

      $(listItem).clear().insertHTML('beforeend', 'Поиск...')

      const searchDATA = await baseSearch(this.DATA, value)

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

  deleteList() {
    const list = this.DOM.searchListParent
    if(list) {
      list.remove()
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

  return new Promise(resolve => {

    setTimeout(() => {

      DATA.reduce((acc, goods) => {

        const searchItem = value.split(' ').join('').toLowerCase()
        const itemWithoutSpaces = goods.name.split(' ').join('').toLowerCase()

        if (value === '') {
          return []
        }
        else if ( itemWithoutSpaces.includes(searchItem) ) {

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

        resolve(acc)
        return acc
      }, [])

    }, 600)
  })
}