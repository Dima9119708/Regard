export function renderLoginHTML() {
  return `
    <button class="header__auth-button" data-auth="auth" type="button">Войти</button>
  `
}

export function renderUserInterface({email}) {
  return `
    <button class="header__auth-button" type="button">${email}</button>
      <div class="header__auth-user-interface">

        <a class="header__auth-user-interface-link" href="#">Моя корзина</a>
        <button class="header__auth-user-interface-button" data-exit="exit" type="button">Выйти</button>

    </div>
  `
}