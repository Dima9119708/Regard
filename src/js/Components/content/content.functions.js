import * as actions from '../../core/redux/actions'
import { ActiveRout } from '../../Routing/ActiveRouter'

function formatNumber(number) {
  return new Intl.NumberFormat('ru-RU').format(number)
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

    const { basket } = store.getState()

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
          <div class="content-product-block" data-id="${item.id}">
            <div class="content-product-block-image">
              <div class="content-product-block-img">
                <img src="./images/235789_600.png" alt="альтернативный текст">&gt;
              </div>
              <span>ID: ${item.id}</span></div>

            <div class="content-product-block-content">
                <div class="content-product-block-name">${item.name}</div>
                <div class="content-product-block-dist">Описание временно нет</div>
                <div class="content-product-block-price">
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

export function addBasketProducts(event, content) {

  const { DATA, store, emmiter } = content

  const addBasket = event.target.closest('[data-addBasket]')

  if ( addBasket ) {
    const { addbasket } = addBasket.dataset

    if (JSON.parse(addbasket)) {

      const { id } = event.target.closest('[data-id]').dataset

      addBasket
        .querySelector('[data-iconCard]')
        .style.color = 'green'

      const goods = DATA.find(elem => elem.id === id)

      const counter = 1
      const { price } = goods

      store.dispath(actions.addBasket(goods))
      store.dispath(actions.sumTotal(+price))
      store.dispath(actions.counter(counter))

      addBasket.setAttribute('data-addBasket', false)
      addBasket.setAttribute('data-goToBasket', true)
      addBasket.title = 'Перейти в корзину'

      emmiter.emit('LOGIN__BAR', true)
      emmiter.emit('HEADER__TOP', true)
    }
  }
}

export function urlParse() {

  const currentURL = decodeURI(ActiveRout.urLHash)

  return currentURL
          .split('/---/')
          .slice(1, currentURL.length)
          .filter(elem => elem !== '')
}

export function reSotingDATA__url(data) {

  const formatURL__STR = urlParse()

  return data.reduce((acc, item ) => {

    const { type, producer, name } = item

    const nameLowCase = name.toLowerCase()
    const typeLowCase = type.toLowerCase()
    const producerLowCase = producer.toLowerCase()
    const paramURL1 = formatURL__STR[0].toLowerCase()
    const paramURL2 = !formatURL__STR[1]
                      ? ''
                      : formatURL__STR[1].toLowerCase()

    if (typeLowCase === paramURL1
      && producerLowCase === paramURL2) {

      acc.push(item)
    }
    else if (typeLowCase === paramURL1
      && paramURL2 === 'all') {

      acc.push(item)
    }
    else if (producerLowCase === paramURL1) {
      acc.push(item)
    }
    else if (nameLowCase === paramURL1) {
      acc.push(item)
    }
    else if (item.name.toLowerCase().includes(paramURL1)) {
      acc.push(item)
    }

    return acc
  }, [])
}