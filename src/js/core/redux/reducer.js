import {
  SEARCH_HISTORY,
  __INIT__,
  ADD_BASKET,
  PRICE__INCREASE,
  DELETE__CARD,
  ADD__WISHLIST,
  CREATE__GROUP,
  DEFAULT__GROUP__ITEM,
  DELETE__GROUP__ITEM,
  CHANGE__GROUP__NAME__ITEM, DELETE__ITEM__GROUPS
} from "./constans";
import {initialState} from "../initialState";

export function reducer(state, action) {

  switch (action.type) {

    case __INIT__ :

      state = { ...initialState, ...state}

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
      })

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

    case ADD__WISHLIST :

      if (!state.currentWishList) {

        const id = Date.now().toString()

        state.currentWishList = id

        state.wishListGroups = {
             ...state.wishListGroups,
             [id] : {
               name : 'Новая группа',
               items : []
             }
        }

        state.wishListGroups[id].items.push(action.card)
      }
      else {
        state.wishListGroups[state.currentWishList].items.push(action.card)
      }

      state.wishListAll.push(action.card)

    return {
      ...state
    }

    case CREATE__GROUP :

      const id = Date.now().toString()

      if (!Object.keys(state.wishListGroups).length) {
        state.currentWishList = id
      }

      state.wishListGroups = {
        ...state.wishListGroups,
        [id] : {
          name : action.input,
          items : []
        },
      }

    return {
      ...state
    }

    case DEFAULT__GROUP__ITEM :

      state.currentWishList = action.id

    return  {
      ...state
    }

    case DELETE__GROUP__ITEM :

      action.items.forEach(item => {
        state.wishListAll.forEach( (elem,index) => {
          if (+item === +elem.id) {
            state.wishListAll.splice(index, 1)
          }
        })
      })

      delete state.wishListGroups[action.id]

      state.currentWishList = !Object.keys(state.wishListGroups).length
                              ? null
                              : Object.keys(state.wishListGroups)[0]

    return {
      ...state
    }

    case CHANGE__GROUP__NAME__ITEM :

      state.wishListGroups[action.id].name = action.name

    return {
      ...state
    }

    case DELETE__ITEM__GROUPS :

      state.wishListGroups[action.groupID].items
            .forEach( (item,index) => {
              if (+item.id === +action.idItem) {
                state.wishListGroups[action.groupID].items.splice(index, 1)
              }
            })

      state.wishListAll.forEach((item,index) => {
          if (+item.id === +action.idItem) {
            state.wishListAll.splice(index, 1)
          }
      })

    return {
      ...state
    }
  }
}