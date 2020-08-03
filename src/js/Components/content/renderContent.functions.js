import { urlParse, formatNumber } from "../../core/utils"
import { $ } from "../../core/Dom"

export function renderTitle() {

  const URLParse = urlParse()
  let titleSearch = ''

  if (!URLParse.length) {
    titleSearch = ''
  }
  else {
    titleSearch = `${URLParse[0]} - ${URLParse[1]}`
  }

  document.title = `
                    Поиск: ${URLParse[0]} - ${URLParse[1] || ''}.
                    Регард - сеть компьютерных магазинов
                  `

  return titleSearch
}

export function checkLackOfGoods(base,showItems, renderCardsTEST) {

  if (!base.length) {
    return 'По вашему запросу ничего не найдено'
  }
  else if (!showItems.length) {
    return 'Страницы не существует'
  }
  else if (renderCardsTEST === '') {
    return 'Товаров нет'
  }

  return ''
}

export function renderRandomContent(number, content) {

  const { DATA, store } = content

  const randomElements = []

  for (let i = 0; i < number; i++) {
    const random = Math.floor(Math.random() * DATA.length)
    randomElements.push(DATA[random])
  }

  return renderProductCards(randomElements, store)
}

export function renderProductCards(data, store) {

  return data.reduce((arr, item) => {

    let addBasket = true
    let colorIcon = 'red'
    let dataTitleButton = 'Добавить в корзину'
    let goToBasket = 'data-goToBasket="false"'

    const basket = store.getState().basket || []

    basket.forEach(goods => {
      if (goods.id === item.id) {
        addBasket = false
        colorIcon = 'green'
        dataTitleButton = 'Перейти в корзину'
        goToBasket = 'data-goToBasket="true"'
      }
    });

    if (item.id && item.name) {

      const elementSTR = `
          <div class="content-block__card" data-id="${item.id}">
            <div class="content-block__card-image-block">
              <div class="content-block__card-img">
                <img src="./images/235789_600.png" alt="альтернативный текст">
              </div>
              <span>ID: ${item.id}</span></div>

            <div class="content-block__card-content">
                <div class="content-block__card-content-name">${item.name}</div>
                <div class="content-block__card-content-dist">Описание временно нет</div>
                <div class="content-block__card-content-price">
                  <span data-addBasket="${addBasket}" ${goToBasket} title="${dataTitleButton}">
                      <i class="fas fa-cart-plus" data-iconCard style="color:${colorIcon}"></i>
                  </span>
                  <span>
                      ${formatNumber(item.price)} руб
                  </span>
                </div>
                </div>
            </div>
        `
      arr.push(elementSTR)
    }

    return arr
  }, []).join('')
}

export function accardion(event, frag) {

  if (frag) {
    event.style.maxHeight = event.scrollHeight + 'px'
    event.setAttribute('data-accardion', true)
    $(event).qSelector('[data-plus]').innerHTML = '-'
    return
  }

  const { scrollHeight, style, dataset } = event
  const plus = $(event).qSelector('[data-plus]')

  if (JSON.parse(dataset.accardion)) {
    style.maxHeight = 23 + 'px'
    event.setAttribute('data-accardion', false)
    style.transition = 'max-height .2s easy'
    if (plus) {
      plus.innerHTML = '+'
    }
  }
  else {
    style.maxHeight = scrollHeight + 'px'
    event.setAttribute('data-accardion', true)

    if (plus) {
      plus.innerHTML = '-'
    }
  }
}