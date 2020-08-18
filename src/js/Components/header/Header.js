
import { ParentComponent } from "../../core/ParentComponent";
import { ActiveRout } from "../../Routing/ActiveRouter";
import {Basket} from "../content/Basket";
import {Sidebar} from "../content/Sidebar";

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
  }

  init() {
    super.init()

    const amount = this.$root.qSelector('[data-sumtotal]')
    const count = this.$root.qSelector('[data-counter]')

    const { sumTotal, counter } = this.store.getState()

    count.innerHTML = counter + ' товаров'
    amount.innerHTML = sumTotal + ' р'

    this.emmiter.subscribe('HEADER__TOP', data => {

      const { sumTotal, counter } = this.store.getState()

      count.innerHTML = counter + ' товаров'
      amount.innerHTML = sumTotal + ' р'
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
            <div class="header-content__basket" data-gotobasket="true">
               <i class="fas fa-cart-arrow-down" data-gotobasket="true"></i>
               <div data-gotobasket="true">
                    В корзине 
                    <span data-counter data-gotobasket="true">0 товаров</span>
               </div>
               На сумму 
               <span data-sumTotal data-gotobasket="true">0 р</span>
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
  }
}
