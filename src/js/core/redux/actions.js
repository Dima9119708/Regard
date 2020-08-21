import {
  SEARCH_HISTORY,
  ADD_BASKET,
  SUM_TOTAL,
  COUNTER,
  PRICE__INCREASE,
  DELETE__CARD,
  ADD__WISHLIST,
  CREATE__GROUP, DEFAULT__GROUP__ITEM, DELETE__GROUP__ITEM, CHANGE__GROUP__NAME__ITEM, DELETE__ITEM__GROUPS
} from "./constans";
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

export function ADD__WISHLIST_ITEM(card) {
  return {
    type : ADD__WISHLIST,
    card
  }
}

export function CREATE__WISHLIST__GROUP(input) {
  return {
    type : CREATE__GROUP,
    input
  }
}

export function DEFAULT__GROUP(id) {
  return {
    type : DEFAULT__GROUP__ITEM,
    id
  }

}

export function DELETE__GROUP(id, items) {
  return {
    type : DELETE__GROUP__ITEM,
    id,
    items
  }
}

export function CHANGE__GROUP__NAME(name,id) {
  return {
    type : CHANGE__GROUP__NAME__ITEM,
    name,
    id
  }

}

export function DELETE__ITEM__GROUP(groupID, idItem) {
  return {
    type : DELETE__ITEM__GROUPS,
    groupID,
    idItem
  }
}