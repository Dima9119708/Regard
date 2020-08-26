import { DomListener } from "./DomListener";
import { ActiveRout } from "../Routing/ActiveRouter";
import {catalog, card, basket, wishList} from "./urlHash.fn";
import {
  renderCatalogContent,
  renderMainContent,
  renderCard,
  renderBasket,
  renderWishList
} from "../Components/content/renderContent";
import { dinamic__adapt } from "./dinamic__adapt";
import {animate} from "./animate";

export class ParentComponent extends DomListener {

  constructor($root, options) {
    super($root, options || {})

    this.store = options.store
    this.DATA = options.DATA
    this.emmiter = options.emmiter
    this.user = options.user
    this.userID = options.userID
    this.reviews = options.reviews

    this.prepare()
  }

  prepare() {}

  init() {
    super.listener()
  }

  // Изменения контента относительно URL
  renderContent() {

    if (ActiveRout.urLHash === '') {
      return renderMainContent(this)
    }
    else if (ActiveRout.urLHash.startsWith(catalog)) {
      return renderCatalogContent(this)
    }
    else if (ActiveRout.urLHash.startsWith(card)) {
      return renderCard(this.card)
    }
    else if (ActiveRout.urLHash.startsWith(basket)) {
      return renderBasket(this.basket)
    }
    else if (ActiveRout.urLHash.startsWith(wishList)) {
      return renderWishList(this.wishList)
    }

    return ''
  }

  // Перерисовка главного контента
  reRenderHTML() {
    this.destroy()

    const contentWrap = document.querySelector('[data-content-wrapper]')
    const reRenderSiderBar = document.querySelector('[data-left-menu]')

    contentWrap.innerHTML = ''
    reRenderSiderBar.innerHTML = ''
    contentWrap.innerHTML = this.renderContent()

    contentWrap.classList.remove('content-wrapper--active')
    animate(contentWrap, 'content-wrapper--active', 100)

    if (window.innerWidth < 1245) {

      dinamic__adapt.__INIT__()

      setTimeout(() => {
        reRenderSiderBar.innerHTML = this.sideBar.renderHTML()
        this.init()
      }, 1000)

      return
    }

    reRenderSiderBar.innerHTML = this.sideBar.renderHTML()
    this.init()
  }

  destroy() {
    super.destroy()
  }
}