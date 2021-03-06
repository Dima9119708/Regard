import { $ } from "./Dom"
import { urlParse } from "./utils";
import { renderProductCards } from "../Components/content/renderContent.functions";
import { catalog } from "./urlHash.fn";
import { ActiveRout } from "../Routing/ActiveRouter";
import { Filter } from "../Components/content/Filter";

export const showItems = 15

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
      <a
        class="content-blocks__pagination-item"
        data-paginationNumber="1"
        data-paginationItem="0"
        data-scroll
        href="#bazinga"
        >
        1
      </a>
      <a
        class="content-blocks__pagination-item">
        ...
      </a>
    `
  },

  finishLine(finishNumber) {

    return `
      <a
        class="content-blocks__pagination-item">
        ...
      </a>
      <a
        class="content-blocks__pagination-item"
        data-paginationNumber="${finishNumber}"
        data-paginationItem="${(finishNumber * showItems) - showItems}"
        data-scroll
        href="#bazinga"
        >
        ${finishNumber}
      </a>
    `
  },

  __INIT__(base) {
    const item = showItems
    this.counterPages = Math.ceil(base.length / item)

    return this.start(this.counterPages)
  },

  start(countPages, pagNumber) {

    let activePage = +pagNumber ? +pagNumber : this.pageActive()

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

  renderItems(start, finish, activePage ) {

    const trainingHTMLPagination = []

    for (let startNumber = start; startNumber < finish + 1; startNumber++) {

      function active() {

        if (startNumber === activePage) {
          return 'content-blocks__pagination-item--active'
        }

        return ''
      }

      trainingHTMLPagination.push(`
        <a
          class="content-blocks__pagination-item ${active()}"
          data-paginationNumber="${startNumber}"
          data-paginationItem="${((startNumber * showItems) - showItems)}"
          data-scroll
          href="#bazinga"
          >

          ${ startNumber}
        </a>
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

    const { store, $root } = content

    const paginationItem = event.target.closest('[data-paginationnumber]')

    if (paginationItem) {

      const $parentCardWrapTop = $root.qSelector('[data-cards]')

      window.scrollTo({
        top: $parentCardWrapTop.offsetTop,
        behavior: "smooth"
      });

      const DATA = Filter.displayСardsBasedOnTheFilter(content)

      const { paginationnumber : pagNumber  } = event.target.dataset

      const pagitanionParent = event.target.closest('[data-pagination]') || $root.qSelector('[data-pagination]')
      const htmlPagination = this.start(this.counterPages, pagNumber)
      $(pagitanionParent).clear().insertHTML('beforeend', htmlPagination)

      if (ActiveRout.urLHash.startsWith(catalog)) {

        this.cardRerender(event, $root, DATA, store, content)
        this.changingURLBasedOnActivePage(pagNumber)
      }

    }
  },

  changingURLBasedOnActivePage(pagNumber) {

    const currentURL = urlParse()
    let hash = ''

    if (currentURL.length <= 3) {
      hash = `${catalog}/+/${currentURL[0]}/+/${currentURL[1]}/+/${pagNumber}`
    }
    else {
      hash = `${catalog}/+/${currentURL[0]}/+/${currentURL[1]}/+/${pagNumber}/+/${currentURL[3]}`
    }

    ActiveRout.hash(hash)
  },

  cardRerender(event, $root, DATA, store, Content) {

    const { paginationitem } = event.target.dataset

    const start = +paginationitem
    const finish = start + (showItems)

    const newBase = DATA.slice(start, finish)

    const $element = $root.qSelector('[data-cards]')

    $($element)
      .clear()
      .insertHTML('beforeend', renderProductCards(newBase, Content))
  }
}
