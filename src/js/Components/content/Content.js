import { ParentComponent } from "../../core/ParentComponent";
import { Sidebar } from "./Sidebar";
import { Search } from "./Search";
import { addBasketProducts } from "./content.functions";
import { ActiveRout } from "../../Routing/ActiveRouter";
import { renderMainContent, renderCatalogContent } from "./renderContent";
import { catalog } from "../../core/urlHash.fn";

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
      return renderCatalogContent(this)
    }

  }

  init() {
    super.init()
  }

  renderHTML() {
    return `
        <div class="content">
          <div class="content-wrap">
              <div class="content-product" data-lsideBar>
                    <div class="content-product-type" data-type>
                          <button class="tab tab--active" type="button" data-tab="tab" data-types="types">По типам</button><button class="tab" type="button" data-tab="tab" data-types="brand" >По брендам</button></div>
                          <ul class="content-product__menu" data-menuProduct>${this.sideBar.renderSideBar()}</ul>
                          </div><main class="content-center">
      <section class="s-content__search">
      <div class="s-content__search-rel" data-search-rel>
      <input class="s-content__input" type="text" data-search="search" placeholder="Поиск среди товаров">

      </div>
      <button class="s-content__find" data-searchButton="search" type="search">Найти</button></section>

      <div class="content-wrapper">
         ${this.renderContent()}
      </div>
      </main>
      </div>

      <div class="content-footer">
      <p>© 2000–2020. Сеть компьютерных магазинов "РЕГАРД". Многоканальная телефонная линия: (495) 921-41-58</p></div></div>
    `
  }

  onClick(event) {
    this.sideBar.eventClick(event)
    this.search.eventClick(event)
    addBasketProducts(event, this)
  }

  onKeydown(event) {
    this.sideBar.eventKeyBoard(event)
    this.search.eventKeyBoard(event)
  }

  onInput(event) {
    this.search.eventInput(event)
  }
}
