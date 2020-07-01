
import { ParentComponent } from "../../core/ParentComponent";

export class Header extends ParentComponent {

  static className = 'header-content'
  static tagName = 'div'

  renderHTML() {
    return `
      <div class="header-content__wrap"><div class="header-content_item"><img src="./images/logo.png" alt=""></div><div class="header-content__contants header-content_item"><div class="header-content__phone header-content__phone-item"><div class="header-content__phones"><div><span>495 </span>921-41-58 </div><div><span>800 </span>250-41-58 </div></div><div class="header-content__consult"><div class="consult-1">Наличие, заказ, консультации</div><div>ПН–ПТ: 9:30 – 20:00</div><div>СБ–ВС: 10:00 – 17:00</div><div class="consult-4">Не дозвонились? </div></div></div><div class="header-content__point header-content__phone-item"><div class="point-1">Пункт выдачи заказов</div><div class="closest-1">Временно закрыт</div></div></div><div class="header-content_item"><div class="header-content__basket"><i class="fas fa-cart-arrow-down"></i><div>В корзине <span>0 товаров</span></div>На сумму <span>0 р</span></div></div></div>
    `
  }
}
