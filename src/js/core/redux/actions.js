import { SEARCH_HISTORY, ADD_BASKET, SUM_TOTAL, COUNTER } from "./constans";

export function searchHistory(data) {

  return {
    type : SEARCH_HISTORY,
    data
  }
}

export function addBasket(goods, price, counter) {
  return {
    type : ADD_BASKET,
    goods,
    price,
    counter
  }
}