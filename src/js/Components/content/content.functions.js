import * as actions from '../../core/redux/actions'
import { catalogHashPath } from '../../core/urlHash.fn'
import { urlParse } from '../../core/utils'

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

      store.dispath(actions.addBasket(goods, +price, counter))

      addBasket.setAttribute('data-addBasket', false)
      addBasket.setAttribute('data-goToBasket', true)
      event.target.setAttribute('data-goToBasket', true)
      addBasket.title = 'Перейти в корзину'

      emmiter.emit('LOGIN__BAR', true)
      emmiter.emit('HEADER__TOP', true)
    }
  }
}

export function reSotingDATA(data) {

  const urlParams = urlParse()

  return data.reduce((acc, item ) => {

    if (item.name && item.price) {

      const { type, producer, name } = item

      const nameLowCase = name.toLowerCase()
      const typeLowCase = type.toLowerCase()
      const producerLowCase = producer.toLowerCase()
      const paramURL1 = urlParams[0].toLowerCase()
      const paramURL2 = urlParams[1].toLowerCase()

      if (typeLowCase === paramURL1
        && producerLowCase === paramURL2) {
        acc.push(item)
      }
      else if (typeLowCase === paramURL1
        && paramURL2 === 'все') {
        acc.push(item)
      }
      else if (producerLowCase === paramURL1) {
        acc.push(item)
      }
      else if (nameLowCase === paramURL1) {
        acc.push(item)
      }
      else if (
        paramURL2 === catalogHashPath.search.toLowerCase()
        || paramURL2 === catalogHashPath.production.toLowerCase()) {

        if (nameLowCase.includes(paramURL1)) {
          acc.push(item)
        }
      }
    }

    return acc
  }, [])
}
