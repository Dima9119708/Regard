import { $ } from "./Dom"
import { auth } from "../Auth/auth"
import MicroModal from "micromodal";

export class Modal {

  static __INIT__(e, $root, flag) {
    const { auth } = e.target.dataset

    if (auth) {

      const modal = Modal.createModal(flag)
      const app = $root.closest('#app')
      app.append(modal)

      MicroModal.init();
      MicroModal.show('modal-1')

      Modal.onClick(modal)
      Modal.onInput(modal)
    }
  }

  static createModal(flag) {
    const createModal = $.create('div', 'modals')

    createModal.innerHTML = `
      <div class="modal micromodal-slide" id="modal-1" aria-hidden="true">
        <div class="modal__overlay" tabindex="-1" data-close="close" data-micromodal-close>
          <div class="modal__container" role="dialog" aria-modal="true" aria-labelledby="modal-1-title">
            ${Modal.#renderContentModal(flag)}
        </div>
      </div>
     </div>
    `

    return createModal
  }

  static #renderContentModal(flag) {

    if (flag === 'Авторизация') {
      return `
      <header class="modal__header">
          <h2 class="modal__title" id="modal-1-title">
            <button class="modal-auth__button modal-auth__button--active" data-login="login" type="button">Вход</button>
            <button class="modal-auth__button" data-reg="reg" type="button">Регистрация</button>
          </h2>
          <button class="modal__close" aria-label="Close modal" data-custom-close="modal-1" data-micromodal-close></button>
        </header>
        <main class="modal__content" id="modal-1-content">
            ${Modal.#renderContentAUTH('login')}
        </main>
      <footer class="modal__footer"></footer>
    `
    }
    else if (flag === 'Спасибо за отзыв') {
      return `
      <header class="modal__header">
        <h2 class="modal__title" id="modal-1-title">
           Спасибо за отзыв. В ближайшее время ваш отзыв, будет опубликован.
        </h2>
        <button class="modal__close" aria-label="Close modal" data-custom-close="modal-1" data-micromodal-close></button>
      </header>
    `
    }
    else if (flag === 'Спасибо за ваш вопрос') {
      return `
      <header class="modal__header">
        <h2 class="modal__title" id="modal-1-title">
           Спасибо за ваш вопрос. В ближайшее время ваш отзыв, будет опубликован.
        </h2>
        <button class="modal__close" aria-label="Close modal" data-custom-close="modal-1" data-micromodal-close></button>
      </header>
    `
    }
    else if (flag === 'Пустое поле') {
      return `
      <header class="modal__header">
        <h2 class="modal__title" id="modal-1-title">
           Поле пустое
        </h2>
        <button class="modal__close" aria-label="Close modal" data-custom-close="modal-1" data-micromodal-close></button>
      </header>
    `
    }
    else if (flag === 'Спасибо за ваш ответ') {
      return `
      <header class="modal__header">
        <h2 class="modal__title" id="modal-1-title">
          Спасибо за ваш ответ. В ближайшее время ваш ответ, будет опубликован.
        </h2>
        <button class="modal__close" aria-label="Close modal" data-custom-close="modal-1" data-micromodal-close></button>
      </header>
    `
    }
  }

  static onClick(node) {
    node.onclick = e => {

      e.preventDefault()

      const { customClose, close, login, reg, reset } = e.target.dataset
      const loginNode = node.querySelector('#modal-1-content')
      const $parent = e.target.closest('#modal-1-title')

      if (customClose || close) {
        Modal.destroy(node)
      }
      else if (login) {
        loginNode.innerHTML = Modal.#renderContentAUTH(login)
      }
      else if (reg) {
        loginNode.innerHTML = Modal.#renderContentAUTH(reg)
      }
      else if (reset) {
        loginNode.innerHTML = Modal.#renderContentAUTH(reset)
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

  static onInput(node) {
    node.oninput = e => { auth(e) }
  }

  static #renderContentAUTH(content) {

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
        <label for="email">Email</label>
        <input type="text" id="email" name="user" title="Username">
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

  static destroy(node) {
    node.onclick = null
    node.oninput = null
    setTimeout(() => node.remove(), 100)
  }
}