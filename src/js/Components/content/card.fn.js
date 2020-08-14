import firebase from 'firebase/app'
import { addBasket, INCREASE__PRICE, CARD__DELETE } from "../../core/redux/actions"
import { formatNumber } from '../../core/utils'

export function validateFeedBack(Card, length) {
  const keys = Object.values(Card.review).map(item => item.trim())
  const $error = Card.$root.qSelector('[data-error]')

  if (keys.length < length) {
    $error.style.display = 'block'
    return null
  }
  else if (keys.includes('')) {
    $error.style.display = 'block'
    return null
  }

  return Card.review
}

export function validateFeedBackAnswer(Card, length) {
  const keys = Object.values(Card.review).map(item => item.trim())

  if (keys.length < length) {
    return null
  }
  else if (keys.includes('')) {
    return null
  }

  return Card.review
}

export function dataFiling(Card, params, $target) {

  const user = Card.userState.personalData.name || 'Ананим'
  const date = new Date().toLocaleDateString()
  const id = Date.now()

  Card.review.user = user
  Card.review.date = date

  if (params === 'Оставить отзыв') {
    Card.review.overallAssessment = (+Card.review.priceAppraisal + +Card.review.qualityAppraisal) / 2
  }

  $target.disable = true
  $target.style.opacity = 0.5

  return {
    id,
    review: Card.review,
  }
}

export async function sendFeedback(Card, review) {

  await firebase
      .database()
      .ref(`reviews/${Card.id}/${review.id}/`)
      .set(review.review)

  Card.review = {}
}

export async function sendFeedbackAnswer(Card, id, review) {

  await firebase
      .database()
      .ref(`reviews/${Card.id}/${id}/answer/${review.id}`)
      .set(review.review)

  Card.review = {}
}

export function reRenderCardHTML(Card, params) {

  if (params === 'Оставить отзыв') {
    Card.DOM.formContentBlock.innerHTML = Card.giveFeedbackHTML()
  }
  else {
    Card.DOM.formContentBlock.innerHTML = Card.AskAQuestionHTML()
  }
}



export async function sendingFeedback(Card, length, params, $target) {

  const keys = Object.values(Card.review).map(item => item.trim())
  const $error = Card.$root.qSelector('[data-error]')

  if (keys.length < length) {
    $error.style.display = 'block'
    return
  }
  else if (keys.includes('')) {
    $error.style.display = 'block'
    return
  }

  const user = Card.userState.personalData.name || 'Ананим'
  const date = new Date().toLocaleDateString()
  const id = Date.now()

  let setReviews = {}

  if (!Object.keys(Card.addReviews)) {
    setReviews = { [id]: Card.review }
  }
  else {
    setReviews = { [id]: Card.review, ...Card.addReviews, }
  }

  Card.addReviews = setReviews

  Card.review.user = user
  Card.review.date = date

  if (params === 'Оставить отзыв') {
    Card.review.overallAssessment = (+Card.review.priceAppraisal + +Card.review.qualityAppraisal) / 2
  }

  $target.disable = false
  $target.style.opacity = 0.8

  await firebase
    .database()
    .ref(`reviews/${Card.id}/`)
    .set(setReviews)

  Card.review = {}

  if (params === 'Оставить отзыв') {
    Card.DOM.formContentBlock.innerHTML = Card.giveFeedbackHTML()
  }
  else {
    Card.DOM.formContentBlock.innerHTML = Card.AskAQuestionHTML()
  }
}

export function addBasketCard(Card) {
  Card.store.dispath(
    addBasket(
      Card.renderElem,
      +Card.renderElem.price,
      1)
  )

  Card.DOM.priceBlock.innerHTML = `
        <div class="goods__price">${formatNumber(Card.renderElem.price)} руб.</div>
        ${Card.addBasket()}
      `

  Card.emmiter.emit('LOGIN__BAR', true)
  Card.emmiter.emit('HEADER__TOP', true)
}

export function priceIncrease(Card, increase) {

  const input = Card.DOM.input || Card.$root.qSelector('[data-input-card]')
  const currentCard = Card.renderElem

  if (increase === 'plus') {
    if (+input.value < +currentCard.availability) {
      input.value++
    }
  }
  else {

    if (+input.value <= 1) {

      Card.store.dispath(CARD__DELETE(Card.renderElem))

      Card.DOM.priceBlock.innerHTML = `
            <div class="goods__price">${formatNumber(Card.renderElem.price)} руб.</div>
            ${Card.addBasket()}
          `
      input.value = 1
    }

    input.value--
  }

  Card.increaseInGoods(+input.value)
  Card.emmiter.emit('LOGIN__BAR', true)
  Card.emmiter.emit('HEADER__TOP', true)

}

export function cardTABS(Card, $parent) {

  const cardTab = event.target.dataset.cardTab

  if (cardTab === 'Характеристики') {
    Card.currentTab = event.target
    Card.DOM.cardInner.innerHTML = Card.specifications()
  }
  else if (cardTab === 'Отзывы') {
    Card.currentTab = event.target
    Card.DOM.cardInner.innerHTML = Card.reviewsHTML()
  }

  $parent.children.forEach(item => {
    item.classList.remove('goods__tabs-item--active')
  });

  if (!Card.currentTab) { return }

  Card.currentTab.classList.add('goods__tabs-item--active')

}

export function formContentTABS(Card, formContent) {

  if (formContent === 'Оставить отзыв') {
    Card.review = {}
    Card.DOM.formContentBlock.innerHTML = Card.giveFeedbackHTML()
  }
  else if (formContent === 'Задать вопрос') {
    Card.review = {}
    Card.DOM.formContentBlock.innerHTML = Card.AskAQuestionHTML()
  }

}

export function productEvaluation(Card, cardChecked) {

  const $parent = event.target.closest('[data-card-checked-parent]')

  $parent.children.forEach(item => {
    item.classList.remove('goods__tabs-form-item-rating-item-button--active')
  })

  event.target.classList.add('goods__tabs-form-item-rating-item-button--active')

  if (cardChecked === 'Цена') {
    Card.review.priceAppraisal = event.target.dataset.cardCheckedNumber
  }
  else if (cardChecked === 'Качество') {
    Card.review.qualityAppraisal = event.target.dataset.cardCheckedNumber
  }

}