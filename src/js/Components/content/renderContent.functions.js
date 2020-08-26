import {urlParse, formatNumber, ratingСalc} from "../../core/utils"
import { $ } from "../../core/Dom"
import {ActiveRout} from "../../Routing/ActiveRouter";
import { wishList } from "../../core/urlHash.fn";

// Вывод в шаблон заголовка страницы
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

// Если товары не находяться
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

// Поготовка рандомных карточек
export function renderRandomContent(number, content) {

  const { DATA } = content

  const randomElements = []

  for (let i = 0; i < number; i++) {
    const random = Math.floor(Math.random() * DATA.length)
    randomElements.push(DATA[random])
  }

  return renderProductCards(randomElements, content)
}

// Подготовка шаблона с карточками
export function renderProductCards(data, Сontent) {

  return data.reduce((arr, item) => {

    const basket = Сontent.store.getState().basket || []

    let addBasket = true
    let colorIcon = 'red'
    let dataTitleButton = 'Добавить в корзину'
    let goToBasket = 'data-goToBasket="false"'

    basket.forEach(goods => {
      if (goods.id === item.id) {
        addBasket = false
        colorIcon = 'green'
        dataTitleButton = 'Перейти в корзину'
        goToBasket = 'data-goToBasket="true"'
      }
    });

    const wishListAll = Сontent.store.getState().wishListAll || []

    let addWishList = true
    let colorIconWishList = '#00CED1'
    let wishListTitle = 'Добавить в список желаемого'
    let goToWishList = 'data-goToWishList="false"'

    wishListAll.forEach(goods => {

      if (goods.id === item.id) {

        addWishList = false
        colorIconWishList = '#FFA500'
        wishListTitle = 'Перейти в список желаемого'
        goToWishList = 'data-goToWishList="true"'
      }
    });

    const card = Сontent.reviews[item.id] || {}
    const rating = ratingСalc()(card)

    function htmlRatingRender() {
      if (rating === '0.0') {
        return ''
      }
      else {
        return `Оценка: <span class="rating"> ${rating} </span>`
      }
    }

    function cardDeleteDisplay() {
      if (ActiveRout.urLHash.startsWith(wishList)) {

        return `
          <div class="content-block__card-delete" data-delete-card="card">
              <i class="fas fa-minus-circle" data-delete-card="card"></i>
          </div>
        `
      }

      return  ''
    }

    function wishListIconDisplay() {
      if (ActiveRout.urLHash.startsWith(wishList)) {
        return ``
      }

      return `
          <i 
            class="fas fa-heart" 
            data-addwishlist="${addWishList}" 
            ${goToWishList}
            title="${wishListTitle}"
            style="color: ${colorIconWishList}"
            >
          </i>
      `
    }

    if (item.id && item.name) {

      const elementSTR = `
          <div class="content-block__card" data-id="${item.id}">
            <div class="content-block__card-image-block">
              <div class="content-block__card-img">
                <img src="./images/235789_600.png" alt="альтернативный текст">
              </div>
              <div class="content-block__card-id">
                ID: ${item.id}
              </div>
              <div class="content-block__card-rating">
                ${htmlRatingRender()}
              </div>
            </div>
            <div class="content-block__card-content">
                <div class="content-block__card-content-name">${item.name}</div>
                <div class="content-block__card-content-dist">Описание временно нет</div>
                <div class="content-block__card-content-price">
                  ${wishListIconDisplay()}
                  <span data-addBasket="${addBasket}" ${goToBasket} title="${dataTitleButton}">
                      <i class="fas fa-cart-plus" 
                        ${goToBasket} 
                        data-iconCard 
                        style="color:${colorIcon}">
                      </i>
                  </span>
                  <span>
                      ${formatNumber(item.price)} руб
                  </span>
                </div>
                </div>
            ${cardDeleteDisplay()}
          </div>
        `
      arr.push(elementSTR)
    }

    return arr
  }, []).join('')
}

export function accardion(event, frag) {

  const { scrollHeight, style, dataset } = event

  if (frag) {
    event.style.maxHeight = event.scrollHeight + 'px'
    event.setAttribute('data-accardion', true)
    $(event).qSelector('[data-plus]').innerHTML = '-'
    return
  }

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

// При обновлении страницы те аккардионы которые открыты даем им maxHeight - для анимации.
export function accardionObjectTrue($root) {

  const accardionItems = $root.qSelectorAll('[data-accardion="true"]')

  accardionItems.forEach(item => {
    item.style.maxHeight = item.scrollHeight + 'px'
  })
}