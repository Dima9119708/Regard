import { ParentComponent } from "../../core/ParentComponent";
import { createModal, modalINITOnClick, modalINITOnInput } from "../../core/modal";
import MicroModal from 'micromodal';
import { renderUserInterface, renderLoginHTML } from "./header-top.content";
import firebase from 'firebase/app'
import { ActiveRout } from "../../Routing/ActiveRouter";

export class HeaderTop extends ParentComponent {

  static className = 'header'
  static tagName = 'header'

  constructor($root, options) {
    super($root, {
      name: 'Header-top',
      listener: ['click'],
      ...options
    })
  }


  renderHTML() {
    return `
      <div class="header-wrap">
        <div class="header__links">
          <a class="header__link" href="#">Конфигуратор ПК</a></div>
        <div class="header__auth">
          ${ this.renderContent() }
        </div>
      </div>
    `
  }


  renderContent() {

    if (this.user) {
      return renderUserInterface(this.user)
    }
    else {
      return renderLoginHTML()
    }

  }

  onClick(event) {

    const { auth, exit } = event.target.dataset

    if (auth) {
      const modal = createModal()
      const app = this.$root.closest('#app')
      app.append(modal)
      MicroModal.init();
      MicroModal.show('modal-1')
      modalINITOnClick(modal)
      modalINITOnInput(modal)
    }
    else if (exit) {
      firebase.auth().signOut()
      ActiveRout.reloadPage()
    }
  }
}

`


`