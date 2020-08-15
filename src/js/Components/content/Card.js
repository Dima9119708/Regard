import { changeURLCard } from "../../core/urlHash.fn"
import { ActiveRout } from "../../Routing/ActiveRouter"
import {urlParse, formatNumber, ratingСalc} from "../../core/utils"
import {INCREASE__PRICE} from "../../core/redux/actions"
import {
  addBasketCard,
  priceIncrease,
  cardTABS,
  formContentTABS,
  productEvaluation,
  validateFeedBack,
  dataFiling,
  sendFeedback,
  reRenderCardHTML,
  sendFeedbackAnswer
} from "./card.fn"
import { Modal} from "../../core/modal"

export class Card {

  constructor(Content) {
    this.content = Content
    this.$root = Content.$root
    this.DATA = Content.DATA
    this.store = Content.store
    this.emmiter = Content.emmiter
    this.id = null
    this.currentTab = null,
    this.user = Content.userID
    this.userState = Content.user
    this.reviews = Content.reviews
    this.review = {}

    this.#searchElemID()
    this.#getAllReviews()
  }

  openPageCard(event, Content) {
    const $goToBasket = event.target.closest('[data-gotobasket]')
    const $target = event.target.closest('[data-id]')

    if ($goToBasket) { return }

    else if ($target) {
      this.id = $target.dataset.id
      const changeUrl = changeURLCard(this.id)
      ActiveRout.setHash(changeUrl)

      this.#searchElemID()
      this.#getAllReviews()
      this.#numberOfReviews()
      this.#calcOfTheOverallRating()

      Content.reRenderHTML()
    }
  }

  get DOM() {

    return {
      input: this.$root.qSelector('[data-input-card]'),
      priceBlock: this.$root.qSelector('[data-priceblock]'),
      cardInner: this.$root.qSelector('[data-card-inner]'),
      formContentBlock: this.$root.qSelector('[data-form-content]')
    }
  }

  renderHTML() {
    return `
      <div class="goods__header">
        <div class="goods__header-id">${this.renderElem.id}</div>
        <h2 class="goods__header-name">${this.renderElem.name}</h2>
      </div>
      <div class="goods__wrap">
          <div class="goods__img">
            <div class="goods__img-block">
              <img src="./images/235789_600.png" alt="альтернативный текст">
            </div>
            <div class="goods__mini-img-block"></div>
          </div>
          <div class="goods-block__dist">
            <div class="goods__dist">Временно нет описание</div>
            <div class="goods__price-block">
                ${this.#availability.html}
                <div class="goods__price-bl" data-priceBlock>
                  <div class="goods__price">${formatNumber(this.renderElem.price)} руб.</div>
                  ${this.addBasket()}
                </div>
            </div>
          </div>
      </div>
      <div class="goods__tabs" data-card-tab-parent>
        <div class="goods__tabs-item" data-card-tab="Характеристики">Характеристики</div>
        <div class="goods__tabs-item" data-card-tab="Отзывы">Отзывы (${this.#numberOfReviews()})</div>
      </div>
      <div class="goods__tabs-content-overall-rating">${this.#calcOfTheOverallRating()}</div>
      <div class="goods__tabs-content-inner" data-card-inner>
      ${this.#HTML__INIT__()}
    `
  }

  #searchElemID() {
    const id = urlParse().join('')
    const item = this.DATA.find(item => item.id === id)
    if (item) {
      this.id = item.id || 0
      return item
    }
  }

  get renderElem() {
    return this.#searchElemID()
  }

  get #availability() {
    const { availability } = this.#searchElemID()

    let inStock = true

    if (+availability < 10) {
      inStock = true
      return {
        inStock,
        html: `
          <div class="goods__price-header">
            <div class="goods__price-existence10">Заканчиваеться</div>
          </div>
        `
      }
    }
    else if (+availability < 1) {

      inStock = false
      return {
        inStock,
        html: `
          <div class="goods__price-header">
            <div class="goods__price-existence1">Нет в наличии</div>
          </div>
        `
      }

    }
    else {

      inStock = true
      return {
        inStock,
        html: `
          <div class="goods__price-header">
            <div class="goods__price-existence">В наличии</div>
          </div>
        `
      }

    }
  }

  addBasket() {

    const basket = !this.store.getState().basket ? [] : this.store.getState().basket

    const ids = basket.map(item => item.id)
    const item = basket.find(item => +item.id === +this.id)

    if (!ids.includes(this.id)) {
      return `
        <div class="goods__add-basket" data-addCard-basket="basket">
          Добавить в корзину
        </div>
      `
    }
    else {
      return `
        <div class="goods__add-basket goods__in-basket">
            Перейти в корзину
            <div class="goods__in-basket"
            style="display: block"
            >
            В корзине
              <input type="number" value="${item.counter || 1}" data-input-card="card">шт
              <button type="button" class="button plus" data-plusAndMinus="plus">+</button> /
              <button type="button" class="button minus" data-plusAndMinus="minus">-</button>
            </div>
        </div>
      `
    }
  }

  #calcOfTheOverallRating() {

    if (!this.addReviews) {
      new Error('Отзывы не нашлись')
      return 'Нет оценки'
    }

    const rating = ratingСalc()(this.addReviews)

    if (rating === '0.0') {
      return '<span>Нет оценки</span>'
    }

    return `Общий рейтинг товара: <span> ${rating} </span>`
  }

  #HTML__INIT__() {
    return `
     <div class="goods__tabs-content">
        <div class="goods__tabs-content-dist">
          Описание временно нет
        </div>
     </div>
    `
  }

  async onClick(event) {

    const addCard = event.target.dataset.addcardBasket
    if (addCard) {
      addBasketCard(this)
    }


    const increase = event.target.dataset.plusandminus
    if (increase) {
      priceIncrease(this, increase)
    }


    const $parent = event.target.closest('[data-card-tab-parent]')
    if ($parent) {
      cardTABS(this, $parent)
    }


    const formContent = event.target.dataset.tabReviews
    formContentTABS(this, formContent)


    const cardChecked = event.target.dataset.cardChecked
    if (cardChecked) {
      productEvaluation(this, cardChecked)
    }


    const leaveAReview = event.target.dataset.leaveAReview
    if (leaveAReview) {

      const reviews = validateFeedBack(this, 5)

      if (!reviews) {
        Modal.__INIT__(event, this.$root, 'Пустое поле')
        return
      }

      const filling = dataFiling(this, 'Оставить отзыв', event.target)
      await sendFeedback(this, filling, 8, 'Отзыв')
      reRenderCardHTML(this, 'Оставить отзыв')
      Modal.__INIT__(event, this.$root, 'Спасибо за отзыв')
    }


    const askAQuestion = event.target.dataset.askAQuestion
    if (askAQuestion) {

      const reviews = validateFeedBack(this, 1)

      if (!reviews) {
        Modal.__INIT__(event, this.$root, 'Пустое поле')
        return
      }

      const filling = dataFiling(this, 'Задать вопрос', event.target)
      await sendFeedback(this, filling, 8, 'Отзыв')
      reRenderCardHTML(this, 'Задать вопрос')
      Modal.__INIT__(event, this.$root, 'Спасибо за ваш вопрос')

    }


    const modalAuth = event.target.dataset.auth
    if (modalAuth) {
      if (!this.user) {
        Modal.__INIT__(event, this.$root, 'Авторизация')
      }
    }


    const answer = event.target.dataset.answer
    if (answer) {
      const $parent = event.target.closest('[data-post-id]')
      const $answer = $parent.querySelector('[data-item-internal]')

      if ($answer.style.display === 'block') {
        $answer.style.display = 'none'
      }
      else {
        $answer.style.display = 'block'
      }
    }


    const answerButton = event.target.dataset.internalCardButton
    if (answerButton) {
      const reviews = validateFeedBack(this,  1)

      if (!reviews) {
        Modal.__INIT__(event, this.$root, 'Пустое поле')
        return
      }

      const post = event.target.closest('[data-post-id]')
      const filling = dataFiling(this, '', event.target)
      await sendFeedback(this, filling, post.dataset.postId, 'Ответ')

      const divAnswer = post.querySelector('[data-block-answer]')
      divAnswer.innerHTML = this.#userInternalAuth()
      Modal.__INIT__(event, this.$root, 'Спасибо за ваш ответ')
    }
  }

  #numberOfReviews() {
    return Object.keys(this.addReviews).length
  }

  #getAllReviews() {
    this.addReviews = this.reviews[this.id]
                       ? this.reviews[this.id]
                       : {}
  }

  onInput(event) {

    const review = event.target.id

    if (review === 'plus' ) {
      this.review.plus = event.target.value
    }
    else if (review === 'minus'){
      this.review.minus = event.target.value
    }

    const textarea = event.target.dataset.cardTextarea

    if (textarea) {
      this.review.dist = event.target.value
    }


  }

  specifications() {
    return this.#HTML__INIT__()
  }

  reviewsHTML() {
    return `
      <div class="goods__tabs-content">
         <div class="goods__tabs-content-form-tabs">
          ${this.#userAuth()}
        </div>
      </div>
      ${this.#renderReviews()}
    `
  }

  #renderReviews() {

    const addReviews = Object.keys(this.addReviews).reduce((acc, item) => {

      const answer = this.addReviews[item].answer || {}

      const answersHTML = Object.keys(answer).reduce((acc,item) => {
        acc.push(`
          <div class="goods__tabs-content-reviews-item-internal-item">
            <div class="goods__tabs-content-reviews-item-internal-item-user"><i class="fas fa-user"></i> ${answer[item].user}</div>
            <div class="goods__tabs-content-reviews-item-internal-item-commet">${answer[item].dist}</div>
          </div>
        `)

        return acc
      }, []).join('')

      if (this.addReviews[item].overallAssessment) {

        acc.push(`
          <div class="goods__tabs-content-reviews" data-post-id="${item}">
            <div class="goods__tabs-content-reviews-item" >
              <div class="goods__tabs-content-reviews-userName"><i class="fas fa-user"></i> ${this.addReviews[item].user}</div>
              <div class="goods__tabs-content-reviews-data"><i class="fas fa-calendar-day"></i> ${this.addReviews[item].date}</div>
              <div class="goods__tabs-content-reviews-plus">
                  <p>Достоинства :</p>
                  <p>${this.addReviews[item].plus}</p>
              </div>
              <div class="goods__tabs-content-reviews-minus">
                  <p>Недостатки :</p>
                  <p>${this.addReviews[item].minus}</p>
              </div>
              <div class="goods__tabs-content-reviews-dist">
              <p>Описание :</p>
              <p> ${this.addReviews[item].dist} </p>
              </div>
              <div class="goods__tabs-content-reviews-price">Цена, оценка :<span>${this.addReviews[item].priceAppraisal}</span></div>
              <div class="goods__tabs-content-reviews-quality">Качество, оценка :<span>${this.addReviews[item].qualityAppraisal}</span></div>
              <div class="goods__tabs-content-reviews-answer" data-answer="answer">
                <i class="fas fa-reply"></i> Ответить (${Object.keys(answer).length})
              </div>

              <div class="goods__tabs-content-reviews-item-internal" data-item-internal style="display : none">
                ${answersHTML}
                ${this.#userInternalAuth()}
              </div>
            </div>
         </div>
        `)
      }
      else {
        acc.push(`
          <div class="goods__tabs-content-reviews" data-post-id="${item}">
          <div class="goods__tabs-content-reviews-item">
            <div class="goods__tabs-content-reviews-userName"><i class="fas fa-user"></i> ${this.addReviews[item].user}</div>
            <div class="goods__tabs-content-reviews-data"><i class="fas fa-calendar-day"></i>${this.addReviews[item].date}</div>
            <div class="goods__tabs-content-reviews-dist">
                <p>Вопрос :</p>
                <p>${this.addReviews[item].dist}</p>
            </div>
            <div class="goods__tabs-content-reviews-answer" data-answer="answer">
                <i class="fas fa-reply"></i> Ответить (${Object.keys(answer).length})
            </div>
            <div class="goods__tabs-content-reviews-item-internal" data-item-internal style="display : none">
              ${answersHTML}
              ${this.#userInternalAuth()}
           </div>
          </div>
        `)
      }

      return acc
    }, []).join('')

    if (addReviews === '') {
      return `

        <div class="goods__tabs-content-reviews">
          <div class="goods__tabs-content-reviews-item"
          style="
          text-align: center;
          font-size: 18px;
          "
          >
            К сожалению еще нет отзывов по данному товару
            <br>
            Будьте первым и оставьте свой отзыв
          </div>
        </div>
      `
    }

    return addReviews
  }

  giveFeedbackHTML() {
    return `
      <div class="error" data-error="error" style="display: none">
        Поля не все заполнены !!!
      </div>
      <div class="goods__tabs-form-item">
        <label class="goods__tabs-form-item-lable" for="plus">Достоинства :</label>
        <input class="goods__tabs-form-item-input" type="text" id="plus">
      </div>
      <div class="goods__tabs-form-item">
        <label class="goods__tabs-form-item-lable" for="minus">Недостатки :</label>
        <input class="goods__tabs-form-item-input" type="text" id="minus">
      </div>
      <div class="goods__tabs-form-item">
          <div class="goods__tabs-form-item-rating">
            <div class="goods__tabs-form-item-rating-item" data-card-checked-parent>
                <p>Цена :</p>
                <button class="goods__tabs-form-item-rating-item-button" type="button" data-card-checked="Цена" data-card-checked-number="1">1</button>
                <button class="goods__tabs-form-item-rating-item-button" type="button" data-card-checked="Цена" data-card-checked-number="2">2</button>
                <button class="goods__tabs-form-item-rating-item-button" type="button" data-card-checked="Цена" data-card-checked-number="3">3</button>
                <button class="goods__tabs-form-item-rating-item-button" type="button" data-card-checked="Цена" data-card-checked-number="4">4</button>
                <button class="goods__tabs-form-item-rating-item-button" type="button" data-card-checked="Цена" data-card-checked-number="5">5</button>
            </div>
            <div class="goods__tabs-form-item-rating-item" data-card-checked-parent>
                <p>Качество :</p>
                <button class="goods__tabs-form-item-rating-item-button" type="button" data-card-checked="Качество" data-card-checked-number="1">1</button>
                <button class="goods__tabs-form-item-rating-item-button" type="button" data-card-checked="Качество" data-card-checked-number="2">2</button>
                <button class="goods__tabs-form-item-rating-item-button" type="button" data-card-checked="Качество" data-card-checked-number="3">3</button>
                <button class="goods__tabs-form-item-rating-item-button" type="button" data-card-checked="Качество" data-card-checked-number="4">4</button>
                <button class="goods__tabs-form-item-rating-item-button" type="button" data-card-checked="Качество" data-card-checked-number="5">5</button>
            </div>
          </div>
      </div>
      <div class="goods__tabs-form-item">
        <textarea class="goods__tabs-form-item-area" data-card-textarea="textarea"></textarea>
      </div>
      <div class="goods__tabs-form-item">
        <button class="goods__tabs-form-item-submit" type="submit" data-leave-a-review="review" data-auth="auth">Оставить отзыв</button>
      </div>
    `
  }

  #userAuth() {
    if (!this.user) {
      return `
        <div class="goods__tabs-noAuth">
            <button class="auth-button" type="button" data-auth="auth">Войти</button>
        </div>
      `
    }
    else {
      return `
        <div class="goods__tabs-content-form-tabs-button">
          <button class="goods__tabs-content-form-tabs-button-item" type="button" data-tab-reviews="Оставить отзыв">Оставить отзыв</button>
          <button class="goods__tabs-content-form-tabs-button-item" type="button" data-tab-reviews="Задать вопрос">Задать вопрос</button>
        </div>
        <form class="goods__tabs-form" data-form-content>
            ${this.giveFeedbackHTML()}
        </form>
      `
    }
  }

  #userInternalAuth() {
    if (!this.user) {
      return `
        <div class="goods__tabs-content-reviews-item-internal-item-noAuth">
          <button class="auth-button" type="button" data-auth="auth">Войти</button>
        </div>
      `
    }
    else {
      return `
        <div data-block-answer>
          <textarea
            class="goods__tabs-content-reviews-item-internal-item-textarea"
            data-card-textarea="textarea"
            >
          </textarea>
          <button
            class="goods__tabs-content-reviews-item-internal-item-button"
            type="submit"
            data-internal-card-button="button"
            data-auth="auth"
            >Отправить
          </button>
        </div>
      `
    }
  }

  AskAQuestionHTML() {
    return `
      <div class="error" data-error="error" style="display: none">
        Поля не все заполнены !!!
      </div>
      <div class="goods__tabs-form-item">
        <label class="goods__tabs-form-item-lable" for="form-item-area">Задать вопрос :</label>
        <textarea class="goods__tabs-form-item-area" id="form-item-area" data-card-textarea="textarea"></textarea>
      </div>
      <div class="goods__tabs-form-item">
        <button class="goods__tabs-form-item-submit" type="submit" data-ask-a-question="question" data-auth="auth">Задать вопрос</button>
      </div>
    `
  }

  increaseInGoods(counter) {
    if (Number.isInteger(counter)) {
      this.store.dispath(INCREASE__PRICE(this.renderElem, counter))
    }
  }
}