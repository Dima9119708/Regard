import firebase from 'firebase/app'
import MicroModal from 'micromodal';
import { modalINITOnClick, modalINITOnInput, createModal } from '../../core/modal';
import { ActiveRout } from '../../Routing/ActiveRouter';

let openMobileMenu = false
export function burgerMobileMenu(event, $root) {

  const $parentMenuMobile = event.target.closest('[data-parentMenuMobile]')

  if ($parentMenuMobile) {

    const menuBtn = $root.qSelector('[data-burger]')
    const headerMenu = $root.qSelector('[data-header-menu]')

    if (!openMobileMenu) {
      menuBtn.classList.add('open');
      headerMenu.classList.add('header__mobile-menu-list--active')
      openMobileMenu = true;
    } else {
      menuBtn.classList.remove('open');
      headerMenu.classList.remove('header__mobile-menu-list--active')
      openMobileMenu = false;
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