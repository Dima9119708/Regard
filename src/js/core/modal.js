import { $ } from "./Dom"
import { auth } from "../Auth/auth"

export function createModal() {

  const createModal = $.create('div', 'modals')

  createModal.innerHTML = `
    <div class="modal micromodal-slide" id="modal-1" aria-hidden="true">
      <div class="modal__overlay" tabindex="-1" data-close="close" data-micromodal-close>
        <div class="modal__container" role="dialog" aria-modal="true" aria-labelledby="modal-1-title">
          <header class="modal__header">
            <h2 class="modal__title" id="modal-1-title">
              <button class="modal-auth__button modal-auth__button--active" data-login="login" type="button">Вход</button>
              <button class="modal-auth__button" data-reg="reg" type="button">Регистрация</button>
            </h2>
            <button class="modal__close" aria-label="Close modal" data-custom-close="modal-1" data-micromodal-close></button>
          </header>
          <main class="modal__content" id="modal-1-content">
             ${renderModalContent('login')}
          </main>
          <footer class="modal__footer"></footer>
      </div>
    </div>
  </div>
  `

  return createModal
}

export function modalINITOnClick(node) {
  node.onclick = e => {

    e.preventDefault()

    const { customClose, close, login, reg, reset } = e.target.dataset
    const loginNode = node.querySelector('#modal-1-content')
    const $parent = e.target.closest('#modal-1-title')

    if (customClose || close) {
      setTimeout( () => node.remove(), 300)
    }
    else if (login) {
      loginNode.innerHTML = renderModalContent(login)
    }
    else if (reg) {
      loginNode.innerHTML = renderModalContent(reg)
    }
    else if (reset) {
      loginNode.innerHTML = renderModalContent(reset)
    }

    if ($parent) {

      for (const item of $parent.children) {
        item.classList.remove('modal-auth__button--active')
      }

      e.target.classList.add('modal-auth__button--active')
    }

    auth(e)
  }
}

export function modalINITOnInput(node) {
  node.oninput = e => { auth(e) }
}

function renderModalContent(content) {

  if (content === 'login') {
    return `
      <div class="fieldset-body" id="login_form">
        <p class="field">
            <label for="email">Email</label>
            <input type="text" id="email" name="email" title="Username">
            <span id="valida" class="i i-warning"></span>
          </p>
          <p class="field">
              <label for="pass">Пароль</label>
              <input type="password" id="pass" name="pass" title="Password">
              <span id="valida" class="i i-close"></span>
          </p>
          <div class="checkbox" data-error></div>
          <a href="#" class="resetPassword" data-reset="reset">Востановить пароль</a>
          <input type="submit" id="sign" value="Вход" title="Get Started">
      </div>
    `
  }
  else if (content === 'reg'){
    return `

    <div class="fieldset-body" id="login_form">

      <p class="field">
        <label for="user">Email</label>
        <input type="text" id="user" name="user" title="Username">
        <span id="valida" class="i i-warning"></span>
      </p>
      <p class="field">
          <label for="pass">Пароль</label>
          <input type="password" id="pass" name="pass" title="Password">
          <span id="valida" class="i i-close"></span>
      </p>
      <p class="field">
          <label for="phone">Телефон</label>
          <input type="text" id="phone" name="phone" title="phone">
          <span id="valida" class="i i-close"></span>
      </p>
      <p class="field">
          <label for="nickName">Ваше Имя</label>
          <input type="text" id="nickName" name="nickName" title="nickName">
          <span id="valida" class="i i-close"></span>
      </p>

      <label class="checkbox" data-error></label>
      <input type="submit" id="reg" value="Регистрация" title="Get Started">
    `
  }
  else if (content === 'reset') {
    return `

      <div class="fieldset-body" id="login_form">

      <p class="field">
        <label for="reset">Email</label>
        <input type="text" id="reset" name="resetEmail" title="resetEmail">
        <span id="valida" class="i i-warning"></span>
      </p>

      <label class="checkbox" data-error></label>
      <input type="submit" id="resetEmail" value="Востановить пароль" title="Get Started">
    `
  }
}
