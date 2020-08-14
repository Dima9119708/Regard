import { ParentComponent } from "../../core/ParentComponent";
import { renderUserInterface, renderLoginHTML } from "./header-top.content";
import { Sidebar } from "../content/Sidebar";
import { burgerMobileMenu, initAndOpeningModalWindow } from "./headerTop.fn";


export class HeaderTop extends ParentComponent {

  static className = 'header'
  static tagName = 'header'

  constructor($root, options) {
    super($root, {
      name: 'Header-top',
      listener: ['click'],
      ...options
    })
  }

  prepare() {
    this.sideBar = new Sidebar(this)
  }

  renderHTML() {
    return `
      <! ПК >
      <div class="header-wrap" >
        <div class="header__links">
          <a class="header__link" href="#">Конфигуратор ПК</a>
        </div>
        <div class="header__mobile-menu" data-parentMenuMobile>
          <div class="menu-btn" data-burger="false">
            <div class="menu-btn__burger"></div>
          </div>
        </div>

        <div class="header__auth" data-auth>
          ${this.#renderContentLogin() }
        </div>
      </div>
    `
  }

  #renderContentLogin() {

    const { personalData } = this.user || {}

    if (personalData) {
      return renderUserInterface(personalData)
    }
    else {
      return renderLoginHTML()
    }
  }

  onClick(e) {
    initAndOpeningModalWindow(e, this.$root, 'Авторизация')
    burgerMobileMenu(event, this.$root)
  }
}
