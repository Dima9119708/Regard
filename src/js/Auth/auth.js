import firebase from 'firebase/app'
import MicroModal from 'micromodal';
import { ActiveRout } from '../Routing/ActiveRouter';
import { validateForm, isValidEmail } from './auth.function';

const form = {
  email: null,
  password: null,
  phone : null,
  name : null
}

export function auth(e) {

  validateForm(e, form)

  const { target } = e

  registration(target)
  login(target)
  resetEmail(target)
}

async function registration(target)  {

  if (target.id === 'reg'
    && form.email !== null
    && form.password !== null
    && form.phone !== null
    && form.name !== null
  ) {

    const $parent = target.closest('#login_form')
    const message = $parent.querySelector('[data-error]')

    target.disabled = true
    target.style.opacity = '.5'

    try {
      const { user } = await firebase
        .auth()
        .createUserWithEmailAndPassword(form.email, form.password)

      await firebase
        .database()
        .ref(`users/${user.uid}/personalData/`)
        .set(form)

      message.innerHTML = 'Регистрация прошла успешно! Теперь вы можете войти в свою учетную запись'
    }
    catch (e) {
      message.innerHTML = e
      firebase.auth().signOut()
    }

    target.disabled = false
    target.style.opacity = '1'
  }
}

async function login(target) {

  if (target.id === 'sign'
    && form.email !== null
    && form.password !== null
  ) {

    const $parent = target.closest('#login_form')
    const message = $parent.querySelector('[data-error]')

    target.disabled = true
    target.style.opacity = '.5'

    try {
      await firebase
        .auth()
        .signInWithEmailAndPassword(form.email, form.password)

      message.innerHTML = 'Вы вошли успешно!'
      MicroModal.close('modal-1')

      const modalDelete = target.closest('#modal-1')
      setTimeout(() => modalDelete.remove(), 300)

      setTimeout(() => ActiveRout.reloadPage(), 400)
    }
    catch (e) {
      message.innerHTML = e
      firebase.auth().signOut()
    }

    target.disabled = false
    target.style.opacity = '1'
  }
}

async function resetEmail(target) {
  if (target.id === 'resetEmail' && form.email !== null) {

    const $parent = target.closest('#login_form')
    const message = $parent.querySelector('[data-error]')

    target.disabled = true
    target.style.opacity = '.5'

    try {
      await firebase.auth().sendPasswordResetEmail(form.email)
      message.innerHTML = 'Информация отправлена вам на почту'

    } catch (e) {
      message.innerHTML = e
    }

    target.disabled = false
    target.style.opacity = '1'
  }
}