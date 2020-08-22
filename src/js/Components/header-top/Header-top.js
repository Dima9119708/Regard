import { ParentComponent } from "../../core/ParentComponent";
import { renderUserInterface, renderLoginHTML } from "./header-top.content";
import { Sidebar } from "../content/Sidebar";
import { burgerMobileMenu } from "./headerTop.fn";
import firebase from "firebase";
import {ActiveRout} from "../../Routing/ActiveRouter";
import {Modal} from "../../core/Modal";
import {Basket} from "../content/Basket";


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
    this.basket = new Basket(this)
  }

  renderHTML() {
    return `
      <! ПК >
      <div class="header-wrap" >
        <div class="header__links"></div>
        <div class="header__mobile-menu" data-parentMenuMobile>
          <div class="menu-btn" data-burger="false">
            <div class="menu-btn__burger"></div>
          </div>
        </div>

        <div class="header__auth" data-auth >
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

  async onClick(e) {
    Modal.__INIT__(e, this.$root, 'Авторизация')
    burgerMobileMenu(e, this.$root)

    const { exit } = e.target.dataset

    if(exit) {
      await firebase.auth().signOut()
      ActiveRout.reloadPage()
    }

    this.basket.openPage(e)

    const { headertopMenu } = e.target.dataset

    if (headertopMenu) {

      const { nextElementSibling } = e.target

      nextElementSibling.style.display === 'none'
      ? nextElementSibling.style.display = 'block'
      : nextElementSibling.style.display = 'none'
    }
  }
}
