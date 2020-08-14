import { SEARCH_HISTORY, __INIT__, ADD_BASKET, PRICE__INCREASE, DELETE__CARD } from "./constans";

export function reducer(state, action) {

  switch (action.type) {

    case __INIT__ :

    return {
      ...state
    }

    case SEARCH_HISTORY :

      let historyDATA = state.history || []
      historyDATA.push(action.data)

      if (action.data === 'clear') {
        historyDATA = []
      }

    return {
      ...state,
      history: historyDATA
    }

    case ADD_BASKET :

      const sumTotal = state.sumTotal || 0
      const counter = state.counter || 0
      const addBasket = state.basket || []

      const sumResult = sumTotal + action.price
      const counterResult = counter + action.counter
      addBasket.push({...action.goods, counter : 1})

    return {
      ...state,
      basket: addBasket,
      sumTotal: sumResult,
      counter: counterResult
    }

    case PRICE__INCREASE :

      let { card, counter : count } = action

      const price = +card.price * count

      card = { ...card, price, 'counter': count}

      state.basket.forEach( (item, index) => {
        if (+item.id === +card.id){
          state.basket.splice(index, 1, card)
        }
      });

      state.sumTotal = 0

      state.basket.forEach( item => {
        state.sumTotal += +item.price
      });

    return {
      ...state
    }

    case DELETE__CARD :

      state.basket.forEach((item,index) => {
        if (+item.id === +action.card.id) {
          state.basket.splice(index, 1)
        }
      })

      state.sumTotal = 0

      state.basket.forEach(item => {
        state.sumTotal += +item.price
      })

      if (state.counter >= 1) {
        state.counter -= 1
      }
      else {
        state.counter = 0
      }

    return {
      ...state,
    }
  }
}