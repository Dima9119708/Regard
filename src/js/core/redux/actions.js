import { SEARCH_HISTORY, ADD_BASKET, SUM_TOTAL, COUNTER } from "./constans";

export function searchHistory(data) {

  return {
    type : SEARCH_HISTORY,
    data
  }
}

export function addBasket(data) {
  return {
    type : ADD_BASKET,
    data
  }
}

export function sumTotal(data) {
  return {
    type : SUM_TOTAL,
    data
  }
}

export function counter(data) {
  return {
    type: COUNTER,
    data
  }
}