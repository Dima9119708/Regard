import { ParentComponent } from "../../core/ParentComponent";
import { Sidebar } from "./Sidebar";
import { Search } from "./Search";
import { addBasketProducts } from "./content.functions";
import { ActiveRout } from "../../Routing/ActiveRouter";
import { renderMainContent, renderCatalogContent } from "./renderContent";
import { catalog } from "../../core/urlHash.fn";
import Swiper from 'swiper'
import { pagination } from "../../core/pagination";
import { Filter } from "./filter";
import { $ } from "../../core/Dom";

export class Content extends ParentComponent {

  static className = 'container'
  static tagName = 'div'

  constructor($root, options) {
    super($root, {
      name: 'Content',
      listener: ['click', 'input', 'keydown'],
      ...options
    })
  }

  prepare() {
    this.sideBar = new Sidebar(this)
    this.search = new Search(this)
  }

  renderContent() {

    if (ActiveRout.urLHash === '') {
      return renderMainContent(this)
    }
    else if (ActiveRout.urLHash.startsWith(catalog)) {
      this.catalogCards = renderCatalogContent(this).base
      return renderCatalogContent(this).content
    }

  }

  init() {
    super.init()
    this.slider__INIT__()

    if(ActiveRout.urLHash.startsWith(catalog)) {
      Filter.rangeSliderINIT(this.$root)
    }
  }

  renderHTML() {
    return `
        <div class="content">
          <div class="content-wrap">
              <div class="content-product" data-lsideBar>
                    <div class="content-product-type" data-type id="data-type">
                          <button
                              class="tab ${this.sideBar.activeClassDom().type}"
                              type="button"
                              data-tab="tab"
                              data-types="types">По типам
                          </button><button
                                    class="tab ${this.sideBar.activeClassDom().brand}"
                                    type="button"
                                    data-tab="tab"
                                    data-types="brand"
                                    >По брендам
                                    </button></div>
                          <ul class="content-product__menu" data-menuProduct>${this.sideBar.render()}</ul>
                          </div><main class="content-center">
      <section class="s-content__search">
      <div class="s-content__search-rel" data-search-rel>
      <input class="s-content__input" type="text" data-search="search" placeholder="Поиск среди товаров">

      </div>
      <button class="s-content__find" data-searchButton="search" type="search">Найти</button></section>

      <div class="content-wrapper" data-content-wrapper>
        ${this.renderContent()}
      </div>
      </main>
      </div>

      <div class="content-footer">
      <p>© 2000–2020. Сеть компьютерных магазинов "РЕГАРД". Многоканальная телефонная линия: (495) 921-41-58</p></div></div>
    `
  }

  onClick(event) {
    this.sideBar.onClick(event)
    this.search.onClick(event)
    addBasketProducts(event, this)

    pagination.onClick(event, this.catalogCards, this.store, this.$root)
    Filter.onClick(event, this.catalogCards, this.store, this.$root)
  }

  onKeydown(event) {
    this.sideBar.onKeyBoard(event)
    this.search.onKeyBoard(event)
  }

  onInput(event) {
    this.search.onInput(event)
  }

  slider__INIT__() {

    const mySwiper = new Swiper('.swiper-1', {
      direction: "horizontal",
      loop: true,

      pagination: {
        el: '.swiper-pag-1',
        clickable: true,
      },

      // Navigation arrows
      navigation: {
        nextEl: '.swiper-next-1',
        prevEl: '.swiper-prev-1',
      },
    })
  }
}