// Реализация бургер меню
export function burgerMobileMenu(event) {

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