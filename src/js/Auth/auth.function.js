import { $ } from "../core/Dom";


// Валидация Email
export function isValidEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}


// Валидация формы
export function validateForm(e, form) {

  const value = e.target.value

  if (value === '') {
    return
  }

  if (e.target.id === 'email') {

    if (isValidEmail(value)) {
      console.log('+')
      e.target.style.border = 'none'
      form.email = value
    }
    else {
      e.target.style.border = '2px solid red'
      form.email = null
    }
  }
  else if (e.target.id === 'pass') {

    if (value.length > 8) {
      e.target.style.border = 'none'
      form.password = value
    }
    else {
      e.target.style.border = '2px solid red'
      form.password = null
    }
  }
  else if (e.target.id === 'phone') {

    if (value.length > 11 && value.length < 13) {
      form.phone = value
      e.target.style.border = 'none'
    }
    else {
      form.phone = null
      e.target.style.border = '2px solid red'
    }

  }
  else if (e.target.id === 'nickName') {

    if (value.length > 4 && value.length < 10) {
      form.name = value
      e.target.style.border = 'none'
    }
    else {
      form.name = null
      e.target.style.border = '2px solid red'
    }
  }
  else if (e.target.id === 'reset') {
    if (isValidEmail(value)) {
      e.target.style.border = 'none'
      form.resetEmail = value
    }
    else {
      e.target.style.border = '2px solid red'
      form.resetEmail = null
    }
  }

  return form
}


// Сбор всех инпутов для проверки  на валидность.
export function collectionOfAllInputs(parent, selector) {
  const $parent = $(parent)
  const inputs = $parent.qSelectorAll(selector)

  inputs.forEach(elem => {
    elem.value.trim()

    if (elem.value === '') {
      elem.style.border = '2px solid red'
    }
  });
}