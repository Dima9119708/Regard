import { $ } from "../../core/Dom";
import { Store } from "../../core/redux/Store";
import { reducer } from "../../core/redux/reducer";
import { initialState } from "../../core/initialState";
import { Emmiter } from "../../core/Emmiter";
import { storage } from "../../core/utils";

export class InitComponent {
  constructor(components, DATA) {
    this.components = components
    this.store = new Store(reducer, storage('REGARD') || initialState)
    this.emmiter = new Emmiter()
    this.DATA = DATA
  }

  getRoot() {

    const options = {
      DATA: this.DATA,
      store: this.store,
      emmiter: this.emmiter
    }

    const main = $.create('div', 'main')

    this.components = this.components.map(Component => {

      const componentDOM = $.create(Component.tagName, Component.className)
      const component = new Component(componentDOM, options)
      componentDOM.insertAdjacentHTML('beforeend', component.renderHTML())
      main.append(componentDOM)

      return component
    });


    this.store.subscribe( data => {
      storage('REGARD', data)
    })

    return main
  }

  init() {
    this.components.forEach(component => component.init());
  }

  destroy() {
    this.components.forEach(component => component.destroy());
    document.onclick = null
  }
}