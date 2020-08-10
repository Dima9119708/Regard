import firebase from 'firebase/app'
import MicroModal from 'micromodal';
import { modalINITOnClick, modalINITOnInput, createModal } from '../../core/modal';;

export function burgerMobileMenu(event, $root) {

  const $burgerParent = event.target.closest('[data-parentMenuMobile]')

  if ($burgerParent) {

    const $burger = $burgerParent.querySelector('[data-burger]')
    const $headerMenu = document.querySelector('[data-header-menu]')

    const burgerOpen = JSON.parse($burger.dataset.burger)

    if (!burgerOpen) {
      $burger.classList.add('open');
      $headerMenu.classList.add('content__mobile-menu-list--active')
      document.body.style.overflowY = 'hidden'
      $burger.setAttribute('data-burger', true);
    } else {
      $burger.classList.remove('open');
      $headerMenu.classList.remove('content__mobile-menu-list--active')
      document.body.style.overflowY = 'scroll'
      $burger.setAttribute('data-burger', false);
    }
  }
}

export function initAndOpeningModalWindow(e, $root) {

  const { auth, exit } = e.target.dataset

  if (auth) {
    const modal = createModal()
    const app = $root.closest('#app')
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