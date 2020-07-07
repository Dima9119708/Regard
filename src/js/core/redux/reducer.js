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

      const addBasket = state.basket || []

      addBasket.push({...action.data, counter : 1})


    return {
      ...state,
      basket: addBasket
    }

    case SUM_TOTAL :

      const sumTotal = state.sumTotal || 0
      const result = sumTotal + action.data

    return {
      ...state,
      sumTotal: result
    }

    case COUNTER :

      const counter = state.counter || 0
      const countResult = counter + action.data

    return {
      ...state,
      counter: countResult
    }
  }

}