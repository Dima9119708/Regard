export function renderLoginHTML() {
  return `
    <button class="auth-button" data-auth="true" type="button">Войти</button>
  `
}

export function renderUserInterface({name}) {


  return `
    <button 
    class="auth-button" 
    type="button" 
    data-headerTop-menu="menu"
    >
    Привет, ${name}
    </button>
    
    <div 
    class="header__auth-user-interface"
    style="display: none"
    >

      <a class="header__auth-user-interface-link" href="#" data-gotobasket="true">Моя корзина</a>
      <button class="header__auth-user-interface-button" data-exit="exit" type="button">Выйти</button>
    </div>
  `
}