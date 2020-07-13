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

  qSelector(selector) {
    return this.$elem.querySelector(selector)
  }

  qSelectorAll(selector) {
    return this.$elem.querySelectorAll(selector)
  }

  insertHTML(position,node) {
    this.$elem.insertAdjacentHTML(position, node)
  }

  clear() {
    this.$elem.innerHTML = ''
    return this
  }

  closest(node) {
    return this.$elem.closest(node)
  }

  returnNode() {
    return this.$elem
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