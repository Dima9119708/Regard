import { SEARCH_HISTORY, __INIT__, ADD_BASKET, SUM_TOTAL, COUNTER } from "./constans";

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
  }

}