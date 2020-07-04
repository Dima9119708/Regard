import { $ } from "../../core/Dom";

export class Sidebar {

  constructor($root, DATA) {
    this.$root = $root
    this.DATA = DATA
  }

  // Рендер SideBar по типам продукта
  renderSideBar() {

    let types = this.DATA.map(elem => elem.type); // сбор всех типов товара

    types = [...new Set(types)] // оставляем только уникальные названия

    const reSort = reSorting(types, this.DATA) // пересортировали массив в объект

    return sideBarHTML(reSort).join('')
  }

  // Рендер всех брендов
  renderBrand() {

    const filterBrand = filterBrands(this.DATA)

    let brands = filterBrand.map(elem => elem.producer);

    brands = [...new Set(brands)]

    return brandsHTML(brands)
  }

  eventClick(event) {

    const sidebar = event.target.closest('[data-lsidebar]')

    if (sidebar) {

      const { tab, types } = event.target.dataset
      const parentProduct = event.target.closest('[data-parentProduct]')

      if (parentProduct) {
        accardion(parentProduct)
      }
      else if (tab) {
        sideBarTAB(event)

        sideBarRenderContent(
          types,
          this.$root,
          this.renderSideBar.bind(this),
          this.renderBrand.bind(this)
        )
      }

    }
  }

  eventKeyBoard(event) {
    const { tab, types } = event.target.dataset
    const parentProduct = event.target.closest('[data-parentProduct]')

    if (parentProduct) {
      accardion(parentProduct, 'Keydown')
    }
    else if (tab) {
      sideBarTAB(event)

      sideBarRenderContent(
        types,
        this.$root,
        this.renderSideBar.bind(this),
        this.renderBrand.bind(this)
      )
    }
  }
}


function reSorting(types, DATA) {

  return types.reduce((acc, type) => {

    acc[type] = []

    DATA.forEach(elem => {

      if (type === elem.type) {
        acc[type].push(elem)
      }
    })

    return acc
  }, {});
}

function sideBarHTML(reSort) {

  return Object.keys(reSort).map(goods => {

    if (goods === '') return

    let brand = reSort[goods].map(elem => elem.producer)

    brand = [...new Set(brand)]

    brand = brand.map(item => {

      if (item) {
        return `
          <li class="content-product__menu-internal-item" data-brand="${item}">
            <a class="content-product__menu-internal-item-link" data-internal-item="internal" href="#">${item}</a>
          </li>
        `
      }
    })

    return `
      <li class="content-product__menu-item" data-parentProduct data-accardion="false" data-goods="${goods}">
      <button class="content-product__menu-item-button" data-buttonMainProduct="MainProduct" type="button"> ${goods}</button>
      <span data-plus>+</span>
          <ul class="content-product__menu-internal" data-internal">
            <li class="content-product__menu-internal-item">
            <a class="content-product__menu-internal-item-link" data-internal-item="internal" href="#">все товары раздела</a></li>
            ${brand.join('')}
          </ul>
      </li>
    `
  })
}

const accardionScrollHeight = (event) => {
  event.style.maxHeight = event.scrollHeight + 'px'
  event.setAttribute('data-accardion', true)
  $(event).qSelector('[data-plus]').innerHTML = '-'
}

function accardion(event, frag) {

  if (frag) {
    accardionScrollHeight(event)
    return
  }

  const { scrollHeight, style, dataset } = event

  if (JSON.parse(dataset.accardion)) {
    style.maxHeight = 26 + 'px'
    event.setAttribute('data-accardion', false)
    $(event).qSelector('[data-plus]').innerHTML = '+'
  }
  else {
    accardionScrollHeight(event)
  }

}

function filterBrands(DATA) {
  return DATA.filter(item => {

    if (item.type === 'Блоки питания'
      || item.type === 'Оперативная память'
      || item.type === 'Корпуса'
      || item.type === 'Жесткие диски (HDD)') {

      return item
    }
  })
}

function brandsHTML(brand) {
  return brand.reduce((acc, item) => {

    if (item) {

      const str = `
          <li
            class="content-product__menu-item"
            data-brand="${item}"
            >
            <a class="content-product__menu-internal-item-link" href="#">${item}</a>
          </li>
      `

      acc.push(str)
    }

    return acc
  }, []).join('')
}

function sideBarTAB(event) {

  const $parent = event.target.closest('[data-type]')

  for (let item of $parent.children) {
    item.classList.remove('tab--active')
  }

  event.target.classList.add('tab--active')
}

function sideBarRenderContent(types, $root, renderSideBar, renderBrand) {

  const menu = $root.qSelector('[data-menuProduct]')

  if (types === 'types') {
    $(menu).clear().insertHTML('beforeend', renderSideBar())
  }
  else if (types === 'brand') {
    $(menu).clear().insertHTML('beforeend', renderBrand())
  }
}