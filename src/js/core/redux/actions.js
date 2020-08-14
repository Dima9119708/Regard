import { SEARCH_HISTORY, ADD_BASKET, SUM_TOTAL, COUNTER, PRICE__INCREASE, DELETE__CARD } from "./constans";
import { renderCard } from "../../Components/content/renderContent";

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

export function INCREASE__PRICE (card, counter) {
  return {
    type : PRICE__INCREASE,
    card,
    counter
  }
}

export function CARD__DELETE(card) {
  return {
    type : DELETE__CARD,
    card
  }
}