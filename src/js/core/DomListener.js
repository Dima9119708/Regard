import { $ } from "./Dom"

const prefixAndUpperCase = method => {
  return 'on' + method[0].toUpperCase() + method.slice(1)
}

export class DomListener {

  constructor($root, { listener, name }) {
    this.$root = $($root)
    this.listener = listener || []
    this.name = name
  }

  // Вешаем прослушку событий на компонент
  listener() {
    this.listener.forEach(listener => {

      const method = prefixAndUpperCase(listener)

      if (!this[method]) {
        throw `метода ${method} нет у компонента ${this.name}`
      }

      this[method] = this[method].bind(this)
      this.$root.on(listener, this[method])
    })
  }

  // Удаляем прослушку событий с компонент
  destroy(){
    this.listener.forEach(listener => {

      const method = prefixAndUpperCase(listener)
      this.$root.off(listener, this[method])
    })
  }

}
