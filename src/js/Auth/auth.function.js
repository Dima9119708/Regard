export function isValidEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export function validateForm(e, form) {

  const value = e.target.value

  if (value === '') {
    return
  }

  if (e.target.id === 'user') {

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

  return form
}