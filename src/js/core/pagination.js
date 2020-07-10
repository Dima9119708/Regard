import { renderProductCards, reSotingDATA__url, urlParse } from "../Components/content/content.functions"
import { $ } from "./Dom"
import { catalog } from "./urlHash.fn";
import { ActiveRout } from "../Routing/ActiveRouter";

export const showItems = 10
const pageTransitionAnimationSpeed = 300

function pageActive() {
  let pageActive = 1
  const urlParseArray = urlParse()

  urlParseArray.forEach(item => {

    if (Number.isInteger(+item)) {
      pageActive = +item
    }

  })

  return pageActive
}

export function paginationNumberRender(base) {

  const item = showItems
  const counterPages = Math.ceil(base.length / item)
  const activePage = pageActive()

  // if (counterPages > 20) {

  //   const slicePagination = new Array(counterPages)
  //                           .fill('')
  //                           .slice(0, 5)
  //                           .map((_, idx) => {

  //                             let active = ''
  //                             if (idx === activePage - 1) {
  //                               active = 'content-blocks__pagination-item--active'
  //                             }

  //                             return `
  //                                       <div
  //                                         class="content-blocks__pagination-item ${active}"
  //                                         data-paginationNumber="${idx + 1}"
  //                                         data-paginationItem="${idx * showItems}">
  //                                         ${idx + 1}
  //                                       </div>
  //                                       `
  //                           })
  //                           .join('')

  //   return
  // }

  return new Array(counterPages)
            .fill('')
            .map((_, idx) => {

              let active = ''
              if (idx === activePage - 1 ) {
                active = 'content-blocks__pagination-item--active'
              }

              return `
                  <div
                    class="content-blocks__pagination-item ${active}"
                    data-paginationNumber="${idx + 1}"
                    data-paginationItem="${idx * showItems}">
                    ${idx + 1}
                  </div>
                  `
            })
            .join('')

}

export function showItemsPagination(base) {
  const start = (pageActive() - 1) * showItems
  return base.slice(start, start + showItems)
}

export function paginationEvent(event, { DATA, store, $root }) {

  const paginationItem = event.target.closest('[data-paginationitem]')

  if (paginationItem) {

    DATA = reSotingDATA__url(DATA)

    paginationActiveInDOM($root)
    renderCardsPagination(event, $root, DATA, store)
    changeURL(event)
  }
}

function changeURL(event) {
  const { paginationnumber } = event.target.dataset

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

function paginationActiveInDOM($root) {
  const itemPagination = $root.qSelectorAll('[data-paginationitem]')

  for (const item of itemPagination) {
    item.classList.remove('content-blocks__pagination-item--active')
  }

  event.target.classList.add('content-blocks__pagination-item--active')
}

function renderCardsPagination(event, $root, DATA, store) {

  const { paginationitem } = event.target.dataset

  const newBase = DATA.slice(+paginationitem, +paginationitem + showItems)

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