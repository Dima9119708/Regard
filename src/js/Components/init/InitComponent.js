import { $ } from "../../core/Dom";

export class InitComponent {
  constructor(components) {
    this.components = components
  }

  getRoot() {

    const main = $.create('div', 'main')

    this.components = this.components.map(Component => {

      const componentDOM = $.create(Component.tagName, Component.className)
      const component = new Component(componentDOM)
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