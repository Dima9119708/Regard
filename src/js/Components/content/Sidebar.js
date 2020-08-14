import { changeURLCalatog, catalogHashPath } from "../../core/urlHash.fn";
import { ActiveRout } from "../../Routing/ActiveRouter";
import { urlParse } from "../../core/utils";
import { accardion } from "./renderContent.functions";

export class Sidebar {

  constructor(content) {
    this.content = content
    this.$root = content.$root
    this.DATA = content.DATA
  }

  get DOM() {
    return {
      brand: this.$root.qSelector('#brand'),
      type: this.$root.qSelector('#type'),
      burgerMenu: document.querySelector('[data-burger]')
    }
  }

  renderHTML() {
    return `
      <div class="content-product" data-lsideBar>
          ${this.#renderContent()}
      </div>
    `
  }

  #renderContent() {
    return `
      <div class="content-product__type" data-type id="data-type">
        <button
            class="content-product__tab ${this.#activeClassDom().type}"
            type="button"
            data-tab="type"
            data-types="types">По типам
        </button>
        <button
          class="content-product__tab ${this.#activeClassDom().brand}"
          type="button"
          data-tab="brand"
          data-types="brand"
          >По брендам
        </button>
    </div>
    <ul class="content-product__menu" data-menuProduct>
      ${this.#renderSideBar()}
      ${this.#renderBrand()}
    </ul>
    `
  }

  renderContentActiveType() {

    const urlParams = urlParse()

    const brand = this.DOM.brand
    const type = this.DOM.type

    if (urlParams[1] === catalogHashPath.production) {
      type.style.display = 'none'
      brand.style.display = 'block'
    }
    else {
      type.style.display = 'block'
      brand.style.display = 'none'
    }
  }

  #activeClassDom() {

    const urlParams = urlParse()

    if (urlParams[1] === catalogHashPath.production) {
      return {
        type : '',
        brand: 'content-product__tab--active'
      }
    }
    else if (!urlParams.length || urlParams.length) {
      return {
        type: 'content-product__tab--active',
        brand : ''
      }
    }
    else {
      return ''
    }

  }

  // Рендер SideBar по типам продукта
  #renderSideBar() {

    let types = this.DATA.map(elem => elem.type ); // сбор всех типов товара

    types = [...new Set(types)] // оставляем только уникальные названия

    const reSort = reSorting(types, this.DATA) // пересортировали массив в объект

    return `<div class="content-product__menu-type" id="type">
      ${trainingSidebarHTML(reSort).join('')}
    </div>
    `
  }

  // Рендер всех брендов
  #renderBrand() {

    const filterBrand = filterBrands(this.DATA)

    let brands = filterBrand.map(elem => elem.producer);

    brands = [...new Set(brands)]

    return `<div class="content-product__menu-type brand" id="brand">
      ${trainingBrandsHTML(brands)}
    </div>
    `
  }

  onClick(event) {

    event.preventDefault()

    const { target } = event

    const sidebar = target.closest('[data-lsidebar]')

    if (sidebar) {

      const { tab, brand } = target.dataset
      const parentProduct = target.closest('[data-parentproduct]')

      if (parentProduct) {
        accardion(parentProduct)
      }
      else if (tab) {
        sidebarTABDOMActive(target)

        const brand = this.DOM.brand
        const type = this.DOM.type

        if (tab === 'brand') {
          type.style.display = 'none'
          brand.style.display = 'block'
        }
        else {
          type.style.display = 'block'
          brand.style.display = 'none'
        }
      }

      if (brand) {

        const { goods } = target.closest('[data-goods]').dataset

        const brands = brand === goods ? catalogHashPath.production : brand

        const $menuMobile = target.closest('[data-header-menu]')

        if ($menuMobile) {

          $menuMobile.classList.remove('content__mobile-menu-list--active')
          this.DOM.burgerMenu.classList.remove('open')

          document.querySelector('[data-burger]').setAttribute('data-burger', false)
          document.body.style.overflowY = 'scroll'
        }

        const urlSTR = changeURLCalatog(goods, brands)
        ActiveRout.setHash(urlSTR)

        this.content.reRenderHTML()
      }
    }
  }

  onKeyBoard(event) {

    const { target } = event

    const { tab, types } = target.dataset
    const parentProduct = target.closest('[data-parentProduct]')

    if (parentProduct) {
      accardion(parentProduct, 'Keydown')
    }
    else if (tab) {
      this.renderSidebarTAB(target, types)
    }
  }
}


function reSorting(types, DATA) {

  return types.reduce((acc, type) => {

    if (type !== '') {

      acc[type] = []

      DATA.forEach(elem => {
        if (type === elem.type) {
          acc[type].push(elem)
        }
      })
    }

    return acc
  }, {});
}

function trainingSidebarHTML(reSort) {

  const urlParams = urlParse()

  return Object.keys(reSort).map(goods => {

    let brand = reSort[goods].map(elem => elem.producer)
    let activeDom = ''
    let activeAllGoodsDom = ''

    brand = [...new Set(brand)]

    brand = brand.map(item => {

      activeDom = ''

      if (urlParams[0] === goods && urlParams[1] === item) {
        activeDom = 'content-product__menu-inside-item-link--active'
      }

      if (item) {
        return `
          <li class="content-product__menu-inside-item" data-brand="${item}">
            <a class="content-product__menu-inside-item-link ${activeDom}" data-brand="${item}" data-internal-item="internal" href="#">${item}</a>
          </li>
        `
      }
    })

    let accardionBoolean = false
    let maxHeight = '23px'

    if (urlParams[0] === goods) {
      accardionBoolean = true,
      maxHeight = '100%'
    }

    if (urlParams[0] === goods) {
      activeDom = 'content-product__menu-inside-item-link--active'
    }

    if (urlParams[0] === goods && urlParams[1] === 'Все') {
      activeAllGoodsDom = 'content-product__menu-inside-item-link--active'
    }

    return `
      <li class="content-product__menu-item "
      data-parentProduct
      data-accardion="${accardionBoolean}"
      data-goods="${goods}"
      style="max-height:${maxHeight}"
      >
      <button class="content-product__menu-item-button ${activeDom}" data-buttonMainProduct="MainProduct" type="button"> ${goods}</button>
      <span data-plus>+</span>
          <ul class="content-product__menu-inside" data-internal">
            <li class="content-product__menu-inside-item">
            <a class="content-product__menu-inside-item-link ${activeAllGoodsDom || ''}" data-brand="Все"  data-internal-item="internal" href="#">все товары раздела</a></li>
            ${brand.join('')}
          </ul>
      </li>
    `
  })
}

function filterBrands(DATA) {

  return DATA.filter(item => {

    if (item.type === 'Блоки питания'
      || item.type === 'Оперативная память'
      || item.type === 'Корпуса'
      || item.type === 'Жесткие диски (HDD)'
      || item.type === 'Сетевые фильтры'
      || item.type === 'Аккумуляторные батареи'
      ) {

      return item
    }
  })
}

function trainingBrandsHTML(brand) {

  const urlParams = urlParse()

  return brand.reduce((acc, item) => {

    if (item) {

      let active = ''
      if (urlParams[0] === item) {
        active = 'content-product__menu-inside-item-link--active'
      }

      const str = `
          <li
            class="content-product__menu-item"
            data-brand="${item}"
            data-goods="${item}"
            >
            <a class="content-product__menu-inside-item-link ${active}"
             data-brand="${item}"
             href="#">${item}
            </a>
          </li>
      `
      acc.push(str)
    }

    return acc
  }, []).join('')
}

function sidebarTABDOMActive(target) {

  const $parent = target.closest('[data-type]')

  for (let item of $parent.children) {
    item.classList.remove('content-product__tab--active')
  }

  event.target.classList.add('content-product__tab--active')
}