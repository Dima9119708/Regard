import { ParentComponent } from "../../core/ParentComponent";

export class LoginBar extends ParentComponent {

  static className = 'loginbar'
  static tagName = 'div'

  renderHTML() {

    return `<span>Перейти в корзину (0 товаров, 0 руб.)</span><span>Мне нужна консультация специалиста</span>`

  }
}