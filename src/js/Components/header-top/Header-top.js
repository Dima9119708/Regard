import { ParentComponent } from "../../core/ParentComponent";
import { createModal, modalINITOnClick, modalINITOnInput } from "../../core/modal";
import MicroModal from 'micromodal';
import { renderUserInterface, renderLoginHTML } from "./header-top.content";
import firebase from 'firebase/app'
import { ActiveRout } from "../../Routing/ActiveRouter";
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
          <div class="menu-btn" data-burger>
            <div class="menu-btn__burger"></div>
          </div>
        </div>

        <div class="header__auth">
          ${this.#renderContent() }
        </div>
      </div>

      <! Мобильное Меню >
      <div class="header__mobile-menu-list" data-header-menu>
        <div class="header__mobile-links">
          <a class="header__mobile-link" href="#">Конфигуратор ПК</a>
        </div>
      </div>
    `
  }


  #renderContent() {

    const { personalData } = this.user || {}

    if (personalData) {
      return renderUserInterface(personalData)
    }
    else {
      return renderLoginHTML()
    }

  }

  onClick(e) {

    initAndOpeningModalWindow(e, this.$root)
    burgerMobileMenu(event, this.$root)
    this.sideBar.onClick(event)
  }
}
