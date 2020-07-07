import { ParentComponent } from "../../core/ParentComponent";

export class LoginBar extends ParentComponent {

  static className = 'loginbar'
  static tagName = 'div'

  constructor($root, options) {
    super($root, {
      name: 'LoginBar',
      listener: [],
      ...options
    })
  }

  init() {
    super.init()

    const loginBar = this.$root.qSelector('[data-loginBar]')

    const { sumTotal, counter } = this.store.getState()

    loginBar
      .innerHTML = `Перейти в корзину
                  (
                    ${counter} товаров,
                    ${sumTotal} руб.
                  )`

    this.emmiter.subscribe('LOGIN__BAR', data => {

      const { sumTotal, counter } = this.store.getState()

      loginBar
        .innerHTML = `Перейти в корзину( ${counter} товаров, ${sumTotal} руб.)`
    })
  }

  renderHTML() {

    return `<span data-loginBar></span><span>Мне нужна консультация специалиста</span>`

  }
}