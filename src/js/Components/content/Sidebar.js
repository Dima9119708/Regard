import { $ } from "../../core/Dom";
import { changeURLCalatog, catalogHashPath } from "../../core/urlHash.fn";
import { ActiveRout } from "../../Routing/ActiveRouter";
import { urlParse } from "../../core/utils";

export class Sidebar {

  constructor(content) {
    this.$root = content.$root
    this.DATA = content.DATA
  }

  render() {
    const urlParams = urlParse()

    if (urlParams[1] === catalogHashPath.production) {
      return this.renderBrand()
    }
    else {
      return this.renderSideBar()
    }


  }

  activeClassDom() {

    const urlParams = urlParse()

    if (urlParams[1] === catalogHashPath.production) {
      return {
        type : '',
        brand: 'tab--active'
      }
    }
    else if (!urlParams.length || urlParams.length) {
      return {
        type: 'tab--active',
        brand : ''
      }
    }
    else {
      return ''
    }

  }

  // Рендер SideBar по типам продукта
  renderSideBar() {

    let types = this.DATA.map(elem => elem.type); // сбор всех типов товара

    types = [...new Set(types)] // оставляем только уникальные названия

    const reSort = reSorting(types, this.DATA) // пересортировали массив в объект

    return trainingSidebarHTML(reSort).join('')
  }

  renderSidebarTAB(target, types) {

    sidebarTABDOMActive(target)
    sideBarRenderContent(
      types,
      this.$root,
      this.renderSideBar.bind(this),
      this.renderBrand.bind(this)
    )

  }

  // Рендер всех брендов
  renderBrand() {

    const filterBrand = filterBrands(this.DATA)

    let brands = filterBrand.map(elem => elem.producer);

    brands = [...new Set(brands)]

    return trainingBrandsHTML(brands)
  }

  onClick(event) {

    event.preventDefault()

    const { target } = event

    const sidebar = target.closest('[data-lsidebar]')

    if (sidebar) {

      const { tab, types,brand } = target.dataset
      const parentProduct = target.closest('[data-parentProduct]')

      if (parentProduct) {
        accardion(parentProduct)
      }
      else if (tab) {
        this.renderSidebarTAB(target,types)
      }

      if (brand) {

        const { goods } = target.closest('[data-goods]').dataset

        const brands = brand === goods ? catalogHashPath.production : brand

        const urlSTR = changeURLCalatog(goods, brands)
        ActiveRout.setHash(urlSTR)
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
    let active = ''

    brand = [...new Set(brand)]

    brand = brand.map(item => {

      active = ''

      if (urlParams[0] === goods && urlParams[1] === item) {
        active = 'content-product__menu-internal-item-link--active'
      }

      if (item) {
        return `
          <li class="content-product__menu-internal-item" data-brand="${item}">
            <a class="content-product__menu-internal-item-link ${active}" data-brand="${item}" data-internal-item="internal" href="#">${item}</a>
          </li>
        `
      }
    })

    let accardionBoolean = false
    let maxHeight = '26px'

    if (urlParams[0] === goods) {
      accardionBoolean = true,
      maxHeight = '100%'
    }

    if (urlParams[0] === goods) {
      active = 'content-product__menu-internal-item-link--active'
    }

    return `
      <li class="content-product__menu-item " data-parentProduct data-accardion="${accardionBoolean}" data-goods="${goods}"
      style="max-height:${maxHeight}"
      >
      <button class="content-product__menu-item-button ${active}" data-buttonMainProduct="MainProduct" type="button"> ${goods}</button>
      <span data-plus>+</span>
          <ul class="content-product__menu-internal" data-internal">
            <li class="content-product__menu-internal-item">
            <a class="content-product__menu-internal-item-link" data-brand="Все"  data-internal-item="internal" href="#">все товары раздела</a></li>
            ${brand.join('')}
          </ul>
      </li>
    `
  })
}

function accardion(event, frag) {

  if (frag) {
    event.style.maxHeight = event.scrollHeight + 'px'
    event.setAttribute('data-accardion', true)
    $(event).qSelector('[data-plus]').innerHTML = '-'
    return
  }

  const { scrollHeight, style, dataset } = event

  if (JSON.parse(dataset.accardion)) {
    style.maxHeight = 26 + 'px'
    event.setAttribute('data-accardion', false)
    $(event).qSelector('[data-plus]').innerHTML = '+'
  }
  else {
    event.style.maxHeight = event.scrollHeight + 'px'
    event.setAttribute('data-accardion', true)
    $(event).qSelector('[data-plus]').innerHTML = '-'
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

function trainingBrandsHTML(brand) {

  const urlParams = urlParse()

  return brand.reduce((acc, item) => {

    if (item) {


      let active = ''
      if (urlParams[0] === item) {
        active = 'content-product__menu-internal-item-link--active'
      }

      const str = `
          <li
            class="content-product__menu-item"
            data-brand="${item}"
            data-goods="${item}"
            >
            <a class="content-product__menu-internal-item-link ${active}"
             data-brand="${item}"
             href="#">${item}</a>
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