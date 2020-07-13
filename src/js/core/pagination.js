import { renderProductCards } from "../Components/content/content.functions"
import { $ } from "./Dom"
import { catalog } from "./urlHash.fn";
import { ActiveRout } from "../Routing/ActiveRouter";
import { urlParse } from "./utils";

export const showItems = 10
const pageTransitionAnimationSpeed = 300

export const pagination = {

  step : 2,
  counterPages : null,

  pageActive: function () {
    let pageActive = 1
    const urlParseArray = urlParse()

    urlParseArray.forEach(item => {

      if (Number.isInteger(+item)) {
        pageActive = +item
      }

    })

    return pageActive
  },

  startLine : function () {
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

  finishLine : function (finishNumber) {

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

  __INIT__: function (base) {

    const item = showItems
    this.counterPages = Math.ceil(base.length / item)

    return this.start(this.counterPages)
  },

  start(countPages, paginationNumber) {
    const activePage = paginationNumber ? +paginationNumber : this.pageActive()

    if (countPages > 20) {

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

  renderItems: function (start, finish, activeNumber) {

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

  showItems: function (base) {
    const start = (this.pageActive() - 1) * showItems
    return base.slice(start, start + showItems)
  },

  onClick: function ($root, base, store) {

    $root = $root.returnNode()

    $root.onclick = event => {

      const paginationItem = event.target.closest('[data-paginationnumber]')

      if (paginationItem) {

        const { paginationnumber } = event.target.dataset

        const pagitanionParent = event.target.closest('[data-pagination]')
        const htmlDATA = this.start(this.counterPages, paginationnumber)
        $(pagitanionParent).clear().insertHTML('beforeend', htmlDATA)

        renderCards(event, $($root), base, store)
        changeURL(paginationnumber)
      }
    }
  },
}

function changeURL (paginationnumber) {
  const currentURL = urlParse()

  currentURL.forEach((item, index) => {
    if (Number.isInteger(+item)) {
      currentURL.splice(index, 1)
    }
  })

  currentURL.push(paginationnumber)

  const newURL = `${catalog}/+/${currentURL.join('/+/')}`
  ActiveRout.paginationHash(newURL)
}

function renderCards(event, $root, DATA, store) {

  const { paginationitem } = event.target.dataset

  const finish = +paginationitem + (showItems)

  const newBase = DATA.slice(+paginationitem, finish)

  const nodeElem = `
      <div class="content-blocks__sorting">Сортировать по : <span>по цене</span></div>
          ${renderProductCards(newBase, store)}
      </div>
    `

  const $element = $root.qSelector('[data-cards]')

  $element.style.opacity = '.40'
  $element.style.transition = 'opacity .2s linear'

  setTimeout(() => {

    $element.style.opacity = '1'
    $element.style.transition = 'opacity .2s linear'
    $($element).clear().insertHTML('beforeend', nodeElem)

  }, pageTransitionAnimationSpeed)
}