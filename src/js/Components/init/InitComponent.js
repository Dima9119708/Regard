import { $ } from "../../core/Dom";
import { Store } from "../../core/redux/Store";
import { reducer } from "../../core/redux/reducer";
import { Emmiter } from "../../core/Emmiter";
import firebase from 'firebase/app'
import { storage } from "../../core/utils";

export class InitComponent {
  constructor(components, DATA, userDATAState, userID, reviews) {
    this.components = components
    this.store = new Store(reducer, userDATAState.userDATA || userDATAState)
    this.emmiter = new Emmiter()
    this.DATA = DATA
    this.user = userDATAState
    this.userID = userID
    this.reviews = reviews
  }

  getRoot() {

    const options = {
      DATA: this.DATA,
      store: this.store,
      emmiter: this.emmiter,
      userID: this.userID,
      user : this.user,
      reviews: this.reviews
    }

    const main = $.create('div', 'main')

    this.components = this.components.map(Component => {

      const componentDOM = $.create(Component.tagName, Component.className)
      const component = new Component(componentDOM, options)
      const html = component.renderHTML()
      componentDOM.insertAdjacentHTML('beforeend', html)
      main.append(componentDOM)

      return component
    });

    this.storeSubscribe()

    return main
  }

  init() {
    this.components.forEach(component => component.init());
  }

  destroy() {
    this.components.forEach(component => component.destroy());
    document.onclick = null
  }

  storeSubscribe() {
    this.store.subscribe( data => {

      if (!this.userID) {
        storage('REGARD', data)
      }
      else {
        setTimeout(async () =>
                          await firebase
                          .database()
                          .ref(`users/${this.userID.uid}/userDATA/`)
                          .set(data),
                        500)
      }
    })
  }
}