import { $ } from "../../core/Dom";

export class InitComponent {
  constructor(components, DATA) {
    this.components = components
    this.DATA = DATA
  }

  getRoot() {

    const options = {
      DATA: this.DATA
    }

    const main = $.create('div', 'main')

    this.components = this.components.map(Component => {

      const componentDOM = $.create(Component.tagName, Component.className)
      const component = new Component(componentDOM, options)
      componentDOM.insertAdjacentHTML('beforeend', component.renderHTML())
      main.append(componentDOM)

      return component
    });

    return main
  }

  init() {
    this.components.forEach(component => component.init());
  }

  destroy() {
    this.components.forEach(component => component.destroy());
  }
}