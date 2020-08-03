import { ParentComponent } from "../../core/ParentComponent";
import { Sidebar } from "./Sidebar";
import { Search } from "./Search";
import { addBasketProducts } from "./content.functions";
import { ActiveRout } from "../../Routing/ActiveRouter";
import { renderMainContent, renderCatalogContent } from "./renderContent";
import { catalog } from "../../core/urlHash.fn";
import { pagination } from "../../core/pagination";
import { Filter } from "./filter";
import 'simplebar';
import { dinamic__adapt } from "../../core/dinamic__adapt";

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

    dinamic__adapt.__INIT__()

    if(ActiveRout.urLHash.startsWith(catalog)) {
      Filter.viewUpdateDom(this)
      Filter.displayСardsBasedOnTheFilter(this)
      Filter.rangeSliderINIT(this, '[data-randeSliderPC]')
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
    `
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
