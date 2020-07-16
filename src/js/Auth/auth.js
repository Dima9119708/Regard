import firebase from 'firebase/app'
import MicroModal from 'micromodal';
import { ActiveRout } from '../Routing/ActiveRouter';

const form = {
  email: null,
  password: null
}

export async function auth(e) {

  validateForm(e, form)

  const { target } = e

  if (target.id === 'reg' && form.email !== null && form.password !== null ) {

    target.disabled = true
    target.style.opacity = '.5'

    const $parent = target.closest('#login_form')
    const errorDIV = $parent.querySelector('[data-error]')

    try {
      await firebase
            .auth()
            .createUserWithEmailAndPassword(form.email, form.password)

      errorDIV.innerHTML = 'Регистрация прошла успешно ! Теперь вы можете войти в свою учетную запись'
    }
    catch (e) {
      errorDIV.innerHTML = e
    }

    target.disabled = false
    target.style.opacity = '1'
  }
  else if (target.id === 'sign' && form.email !== null && form.password !== null ) {

    target.disabled = true
    target.style.opacity = '.5'

    const $parent = target.closest('#login_form')
    const errorDIV = $parent.querySelector('[data-error]')

    try {
      await firebase
              .auth()
              .signInWithEmailAndPassword(form.email, form.password)

      errorDIV.innerHTML = 'Вы вошли успешно!'
      MicroModal.close('modal-1')

      const modalDelete = e.target.closest('#modal-1')
      setTimeout(() => modalDelete.remove(), 300)

      setTimeout(() => ActiveRout.reloadPage(), 400)
    }
    catch (e) {
      errorDIV.innerHTML = e
    }

    target.disabled = false
    target.style.opacity = '1'
  }
}

function isValidEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validateForm(e, form) {

  if (e.target.id === 'user') {

    const { value } = e.target

    if (isValidEmail(value)) {
      e.target.style.border = 'none'
      form.email = value
    }
    else {
      e.target.style.border = '2px solid red'
      form.email = null
    }
  }
  else if (e.target.id === 'pass') {

    const { value } = e.target

    if (value.length > 8) {
      e.target.style.border = 'none'
      form.password = value
    }
    else {
      e.target.style.border = '2px solid red'
      form.password = null
    }
  }

  return form
}
