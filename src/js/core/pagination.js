import { $ } from "./Dom"
import { urlParse } from "./utils";
import { renderProductCards } from "../Components/content/renderContent.functions";
import { catalog } from "./urlHash.fn";
import { ActiveRout } from "../Routing/ActiveRouter";
import { Filter } from "../Components/content/Filter";

export const showItems = 10
export const pageTransitionAnimationSpeed = 300

export const pagination = {

  step : 2,
  counterPages : null,

  pageActive() {
    let pageActive = 1
    const urlParseArray = urlParse()

    urlParseArray.forEach(item => {

      if (Number.isInteger(+item)) {
        pageActive = +item
      }

    })

    return pageActive
  },

  startLine() {
    return `
      <div
        class="content-blocks__pagination-item"
        data-paginationNumber="1"
        data-paginationItem="0">
        1
      </div>
      <div
        class="content-blocks__pagination-item">
        ...
      </div>
    `
  },

  finishLine(finishNumber) {

    return `
      <div
        class="content-blocks__pagination-item">
        ...
      </div>
      <div
        class="content-blocks__pagination-item"
        data-paginationNumber="${finishNumber}"
        data-paginationItem="${(finishNumber * showItems) - showItems}">
        ${finishNumber}
      </div>
    `
  },

  __INIT__(base) {
    const item = showItems
    this.counterPages = Math.ceil(base.length / item)

    return this.start(this.counterPages)
  },

  start(countPages, paginationNumber) {
    let activePage = paginationNumber ? +paginationNumber : this.pageActive()

    if (countPages > 10) {

      // Если мы приближаемся к концу
      if ((activePage + 5) > countPages) {

        return this.startLine()
               +
               this.renderItems(countPages - 5, countPages, activePage)

      }

      // Если мы находисмся в начале
      else if ((activePage - 5) < 1) {

        return this.renderItems(1, 7, activePage)
               +
               this.finishLine(countPages)

      }

      // Если мы в промежутке
      else {

        const start = activePage - this.step
        const finish = activePage + this.step

        return this.startLine()
               +
               this.renderItems(start, finish, activePage)
               +
               this.finishLine(countPages)
      }
    }

    // Если страниц меньше чем 20, то просто выводить пагинацию
    else {
      return this.renderItems(1, countPages, activePage)
    }

  },

  renderItems(start, finish, activeNumber) {

    const trainingHTMLPagination = []

    for (let startNumber = start; startNumber < finish + 1; startNumber++) {

      let active = ''
      if (startNumber === activeNumber) {
        active = 'content-blocks__pagination-item--active'
      }

      trainingHTMLPagination.push(`
        <div
          class="content-blocks__pagination-item ${active}"
          data-paginationNumber="${startNumber}"
          data-paginationItem="${((startNumber * showItems) - showItems)}" >

          ${ startNumber}
        </div>
      `)
    }

    return trainingHTMLPagination.join('')
  },

  showItems(base) {

    let pageActive = this.pageActive() - 1

    const start = pageActive * showItems
    return base.slice(start, start + showItems)
  },

  onClick(event, content) {

    let { catalogCards: DATA, store, $root } = content

    const paginationItem = event.target.closest('[data-paginationnumber]')

    if (paginationItem) {

      const filteredСards = Filter.displayСardsBasedOnTheFilter(content)

      if (filteredСards) {
        DATA = filteredСards
      }

      const { paginationnumber } = event.target.dataset

      const pagitanionParent = event.target.closest('[data-pagination]') || $root.qSelector('[data-pagination]')
      const htmlPagination = this.start(this.counterPages, paginationnumber)
      $(pagitanionParent).clear().insertHTML('beforeend', htmlPagination)

      this.cardRerender(event, $root, DATA, store)
      this.changingURLBasedOnActivePage(paginationnumber)
    }
  },

  changingURLBasedOnActivePage(paginationnumber) {

    const currentURL = urlParse()
    let hash = ''

    if (currentURL.length <= 3) {
      hash = `${catalog}/+/${currentURL[0]}/+/${currentURL[1]}/+/${paginationnumber}`
    }
    else {
      hash = `${catalog}/+/${currentURL[0]}/+/${currentURL[1]}/+/${paginationnumber}/+/${currentURL[3]}`
    }

    ActiveRout.hash(hash)
  },

  cardRerender(event, $root, DATA, store) {

    const { paginationitem } = event.target.dataset

    const start = +paginationitem
    const finish = start + (showItems)

    const newBase = DATA.slice(start, finish)

    const $element = $root.qSelector('[data-cards]')

    $($element)
      .clear()
      .insertHTML('beforeend', renderProductCards(newBase, store))
  }
}
