import { ParentComponent } from "../../core/ParentComponent";
import { Sidebar } from "./Sidebar";
import { Search } from "./Search";
import { addBasketProducts, reSotingDATA} from "./content.functions";
import { ActiveRout } from "../../Routing/ActiveRouter";
import { catalog } from "../../core/urlHash.fn";
import { pagination } from "../../core/pagination";
import { Filter } from "./filter";
import 'simplebar';
import { accardionObjectTrue } from "./renderContent.functions";
import { dinamic__adapt } from "../../core/dinamic__adapt";
import { renderCatalogContent, renderMainContent } from "./renderContent";

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

  init() {
    super.listener()

    dinamic__adapt.__INIT__()
    accardionObjectTrue(this.$root)

    if (ActiveRout.urLHash.startsWith(catalog)) {
      Filter.viewUpdateDom(this)
      this.sideBar.renderContentActiveType()
      Filter.displayСardsBasedOnTheFilter(this)
      Filter.rangeSliderINIT(this, '[data-randeSliderPC]')
    }
  }

  renderContent() {

    if (ActiveRout.urLHash === '') {
      return renderMainContent(this)
    }
    else if (ActiveRout.urLHash.startsWith(catalog)) {
      return renderCatalogContent(this)
    }
  }

  renderHTML() {
    return `
      <div class="content">
        <div class="content-wrap">
          ${this.sideBar.renderHTML()}
          <main class="content-center">
            ${this.search.renderHTML()}

            <div class="content-wrapper" data-content-wrapper>
              ${this.renderContent()}
            </div>
        </main>
       </div>

        <div class="content-footer">
          <p>© 2000–2020. Сеть компьютерных магазинов "РЕГАРД". Многоканальная телефонная линия: (495) 921-41-58</p>
        </div>
      </div>

      <! Мобильное Меню >
      <div class="content__mobile-menu-list" data-header-menu>
        <div class="content__mobile-links">
          <a class="content__mobile-link" href="#">Конфигуратор ПК</a>
        </div>
      </div>
    `
  }


  reRenderHTML() {
    this.destroy()

    const contentWrap = this.$root.qSelector('[data-content-wrapper]')
    const reRenderSiderBar = this.$root.qSelector('[data-menuProduct]')

    contentWrap.innerHTML = this.renderContent()

    if (window.innerWidth < 1245) {

      setTimeout(() => {
        reRenderSiderBar.innerHTML = this.sideBar.renderContent()
        this.sideBar.renderContentActiveType()
        accardionObjectTrue(this.$root)
      }, 1000)

      this.init()
      return
    }

    reRenderSiderBar.innerHTML = this.sideBar.renderContent()
    this.init()
  }

  onClick(event) {
    this.sideBar.onClick(event)
    this.search.onClick(event)
    addBasketProducts(event, this)

    pagination.onClick(event, this)
    Filter.onClick(event, this)
  }

  onKeydown(event) {
    this.sideBar.onKeyBoard(event)
    this.search.onKeyBoard(event)
  }

  onInput(event) {
    this.search.onInput(event)
  }
}
