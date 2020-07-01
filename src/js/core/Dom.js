class Dom {
  constructor(element) {

    this.$elem = typeof element === 'string'
                ? document.querySelector(element)
                : element

  }

  appendNode(node) {
    this.$elem.append(node)
  }

  on(event, fn) {
    this.$elem.addEventListener(event, fn)
  }

  off(event, fn) {
    this.$elem.removeEventListener(event, fn)
  }

  clear() {
    this.$elem.innerHTML = ''
    return this
  }
}

export function $(element) {
  return new Dom(element)
}

$.create = (tagName, className) => {

  const createElem = document.createElement(tagName)

  if (className) {
    createElem.classList.add(className)
  }

  return createElem
}