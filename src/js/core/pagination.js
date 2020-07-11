import { renderProductCards, urlParse } from "../Components/content/content.functions"
import { $ } from "./Dom"
import { catalog } from "./urlHash.fn";
import { ActiveRout } from "../Routing/ActiveRouter";

export const showItems = 10
const pageTransitionAnimationSpeed = 300

export const pagination = {

  __INIT__: function (base) {

    const item = showItems
    const counterPages = Math.ceil(base.length / item)


    const slicePagination = new Array(counterPages)
      .fill('')
      .map(this.renderItems(counterPages))

    return slicePagination.join('')
  },

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

  renderItems: function (pages) {

    const counterPages = pages
    let displayStyle = 'block'

    return (_, idx) => {

      const activePage = this.pageActive()
      let active = ''

      if (idx === activePage - 1) {
        active = 'content-blocks__pagination-item--active'
      }

      return `
      <div
        class="content-blocks__pagination-item ${active}"
        data-paginationNumber="${idx + 1}"
        data-paginationItem="${idx * showItems}"
        style="display: ${displayStyle}">
        ${idx + 1}
      </div>
      `
    }
  },

  showItems: function (base) {
    const start = (this.pageActive() - 1) * showItems
    return base.slice(start, start + showItems)
  },

  eventClick: function ($root, base, store) {

    $root = $root.returnNode()

    $root.onclick = event => {

      const paginationItem = event.target.closest('[data-paginationitem]')

      if (paginationItem) {

        const parent = $($root)
        const { paginationnumber } = event.target.dataset

        renderCards(event, parent, base, store)
        changeURL(paginationnumber)
        this.activeInDOMElem(parent)
      }
    }
  },

  activeInDOMElem: function ($root) {
    const itemPagination = $root.qSelectorAll('[data-paginationitem]')

    for (const item of itemPagination) {
      item.classList.remove('content-blocks__pagination-item--active')
    }

    event.target.classList.add('content-blocks__pagination-item--active')
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