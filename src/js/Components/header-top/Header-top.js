import { ParentComponent } from "../../core/ParentComponent";

export class HeaderTop extends ParentComponent {

  static className = 'header'
  static tagName = 'header'

  renderHTML() {
    return `
      <div class="header-wrap">
        <a class="header__link" href="#">Конфигуратор ПК</a>
      </div>
    `
  }
}