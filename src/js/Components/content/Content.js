import { ParentComponent } from "../../core/ParentComponent";
import { Sidebar } from "./Sidebar";
import { Search } from "./Search";
import { addBasketProducts} from "./content.functions";
import { ActiveRout } from "../../Routing/ActiveRouter";
import {catalog, card, basket, wishList} from "../../core/urlHash.fn";
import { pagination } from "../../core/pagination";
import { Filter } from "./filter";
import 'simplebar';
import { accardionObjectTrue } from "./renderContent.functions";
import { dinamic__adapt } from "../../core/dinamic__adapt";
import { Card } from "./Card";
import {Basket} from "./Basket";
import {WishList} from "./WishList";

export class Content extends ParentComponent {

  static className = 'container'
  static tagName = 'div'

  constructor($root, options) {
    super($root, {
      name: 'Content',
      listener: ['click', 'input', 'keydown', 'change'],
      ...options
    })
  }

  prepare() {
    this.sideBar = new Sidebar(this)
    this.search = new Search(this)
    this.card = new Card(this)
    this.basket = new Basket(this)
    this.wishList = new WishList(this)
  }

  init() {
    super.listener()

    dinamic__adapt.__INIT__()
    accardionObjectTrue(this.$root)

    this.search.DOM
    this.sideBar.DOM

    if (ActiveRout.urLHash.startsWith(catalog)) {

      Filter.viewUpdateDom(this)
      Filter.displayСardsBasedOnTheFilter(this)
      Filter.rangeSliderINIT(this, '[data-randeSliderPC]')

      this.sideBar.renderContentActiveType()
    }
    else if (ActiveRout.urLHash.startsWith(card)) {
      this.card.DOM
    }
    else if (ActiveRout.urLHash.startsWith(basket)) {
      this.basket.DOM
    }
    else if (ActiveRout.urLHash.startsWith(wishList)) {
      this.wishList.DOM
    }
  }

  renderHTML() {
    return `
      <div class="content">
        <div class="content-wrap">
          <div class="content-left__menu" data-left-menu data-da="[data-header-menu],1,1245,max">
            ${this.sideBar.renderHTML()}
          </div>
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
      <div class="content__mobile-menu-list" data-header-menu></div>
    `
  }

  onClick(event) {
    this.sideBar.onClick(event)
    this.search.onClick(event)

    this.basket.openPage(event)
    this.basket.onClick(event)

    addBasketProducts(event, this)

    this.wishList.openPage(event)
    this.wishList.addWishListCard(event)
    this.wishList.onClick(event)

    pagination.onClick(event, this)
    Filter.onClick(event, this)

    this.card.openPageCard(event, this)
    this.card.onClick(event)
  }

  onKeydown(event) {
    this.sideBar.onKeyBoard(event)
    this.search.onKeyBoard(event)
  }

  onChange(event) {

    const { target } = event
    const currentCard = target.dataset.inputCard

    if (currentCard) {
      if (!target.value) {
        target.value = 1
      }
      else if (+target.value <= 0) {
        target.value = 1
      }

      if (ActiveRout.urLHash.startsWith(card)) {
        this.card.increaseInGoods(+target.value)
      }
      else if (ActiveRout.urLHash.startsWith(basket)) {
        const id = target.closest('[data-idCard]').dataset.idcard
        this.basket.onChange(+target.value, id)
      }

      this.emmiter.emit('LOGIN__BAR', true)
      this.emmiter.emit('HEADER__TOP', true)
    }

  }

  onInput(event) {
    this.search.onInput(event)
    this.card.onInput(event)
  }
}
