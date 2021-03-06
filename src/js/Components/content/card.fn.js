import { addBasket,
        CARD__DELETE
} from "../../core/redux/actions"

import { formatNumber } from '../../core/utils'

// Валидация отправки отзыва
export function validateFeedBack(Card, length) {
  const keys = Object.values(Card.review).map(item => item.trim())

  if (keys.length < length) {
    return null
  }
  else if (keys.includes('')) {
    return null
  }

  return Card.review
}


// Формирование отзыва
export function dataFiling(Card, params, $target) {

  const user = Card.userState.personalData.name || 'Ананим'
  const date = new Date().toLocaleDateString()
  const id = Date.now()

  Card.review.user = user
  Card.review.date = date

  if (params === 'Оставить отзыв') {
    Card.review.overallAssessment =
              (+Card.review.priceAppraisal + +Card.review.qualityAppraisal) / 2
  }

  $target.disable = true
  $target.style.opacity = 0.5

  return {
    id,
    review: Card.review,
  }
}


// После успешной отравки отзывы, перерисовка блока (Оставить отзыв или Задать вопрос)
export function reRenderCardHTML(Card, params) {

  if (params === 'Оставить отзыв') {
    Card.DOM.formContentBlock.innerHTML = Card.giveFeedbackHTML()
  }
  else {
    Card.DOM.formContentBlock.innerHTML = Card.askAQuestionHTML()
  }
}


// Добавление товара в корзину(Redux)
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


// Увеличение цены в карточке товара и сохранение в Redux
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


// Табы в карточке товара (Характеристики, Отзывы)
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


// Табы в карточке товара ( Оставить отзыв или Задать вопрос )
export function formContentTABS(Card, formContent) {

  if (formContent === 'Оставить отзыв') {
    Card.DOM.formContentBlock.innerHTML = Card.giveFeedbackHTML()
  }
  else if (formContent === 'Задать вопрос') {
    Card.DOM.formContentBlock.innerHTML = Card.askAQuestionHTML()
  }

  Card.review = {}
}


// Сохранение рейтинга в Redux и Отображение в DOM
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