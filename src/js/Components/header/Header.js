
import { ParentComponent } from "../../core/ParentComponent";
import { ActiveRout } from "../../Routing/ActiveRouter";
import {Basket} from "../content/Basket";
import {Sidebar} from "../content/Sidebar";
import {WishList} from "../content/WishList";

export class Header extends ParentComponent {

  static className = 'header-content'
  static tagName = 'div'

  constructor($root, options) {
    super($root, {
      name: 'Header',
      listener: ['click'],
      ...options
    })
  }

  prepare() {
    this.sideBar = new Sidebar(this)
    this.basket = new Basket(this)
    this.wishList = new WishList(this)
  }

  init() {
    super.init()

    const count = this.$root.qSelector('[data-counter]')
    const wishListCount = this.$root.qSelector('[data-WishList-count]')

    const { counter, wishListAll } = this.store.getState()

    count.innerHTML = counter
    wishListCount.innerHTML = wishListAll.length

    this.emmiter.subscribe('HEADER__TOP', data => {

      const { counter, wishListAll } = this.store.getState()

      count.innerHTML = counter
      wishListCount.innerHTML = wishListAll.length
    })
  }

  renderHTML() {
    return `
      <div class="header-content__wrap">
         <a href="#" class="header-content_item" data-logo="logo">
         <img src="./images/logo.png" alt="logo" data-logo="logo">
         </a>
         <div class="header-content__contants header-content_item">
            <div class="header-content__phone header-content__phone-item">
               <div class="header-content__phones">
                  <div><span>800 </span>444-42-44 </div>
                  <div><span>999 </span>333-60-58
                  </div>
               </div>
               <div class="header-content__consult">
                  <div class="consult-1">Наличие, заказ, консультации</div>
                  <div>ПН–ПТ: 9:30 – 20:00</div>
                  <div>СБ–ВС: 10:00 – 17:00</div>
               </div>
            </div>
            <div class="header-content__point header-content__phone-item">
               <div class="point-1">Пункт выдачи заказов</div>
               <div class="closest-1">Временно закрыт</div>
            </div>
         </div>
         <div class="header-content_item">
            <div class="header-content__basket" >
                
               <i class="far fa-heart" data-goToWishList="true">
                    <div 
                     class="header-content__basket-count" data-goToWishList="true" data-WishList-count>
                     ${this.store.getState().wishListAll.length || 0}
                    </div>
                </i>
                
               <i class="fas fa-cart-arrow-down" data-gotobasket="true">
                   <div 
                     class="header-content__basket-count" 
                     data-gotobasket="true" 
                     data-counter>
                   </div>
               </i>
               
            </div>
         </div>
      </div>
    `
  }

  onClick(event) {
    const logo = event.target.dataset.logo

    if (logo) {
      ActiveRout.setHash('')
      this.reRenderHTML()
    }

    this.basket.openPage(event)
    this.wishList.openPage(event)
  }
}
