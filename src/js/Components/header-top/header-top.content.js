export function renderLoginHTML() {
  return `
    <button class="header__auth-button" data-auth="true" type="button">Войти</button>
  `
}

export function renderUserInterface({name}) {


  return `
    <button class="header__auth-button" type="button">Привет, ${name}</button>
      <div class="header__auth-user-interface">

        <a class="header__auth-user-interface-link" href="#">Моя корзина</a>
        <button class="header__auth-user-interface-button" data-exit="exit" type="button">Выйти</button>

    </div>
  `
}