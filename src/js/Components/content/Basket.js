import {changeURLBasket, changeURLCard} from "../../core/urlHash.fn";
import {ActiveRout} from "../../Routing/ActiveRouter";
import {formatNumber, searchItemID} from "../../core/utils";
import {CARD__DELETE, INCREASE__PRICE} from "../../core/redux/actions";

export class Basket {
    constructor(Content) {
        this.content = Content
        this.store = Content.store
        this.DATA = Content.DATA
        this.$root = Content.$root
        this.emmiter = Content.emmiter
    }

    get DOM () {
        return {
            $totalAmount : this.$root.qSelector(`[data-totalAmount]`)
        }

    }

    openPage(event ) {

        const basket = event.target.dataset.gotobasket

        if ( basket === 'true') {
            ActiveRout.setHash(changeURLBasket())
            this.content.reRenderHTML()
        }

    }

    renderHTML() {
        return `
          ${this.#renderCards()}
        `
    }

    #getCards() {
        const basket = this.store.getState().basket || []

        return basket.reduce((acc,item) => {

            acc.push(`
                <div class="basket-product__items-inner" data-idCard="${item.id}">
                   <div class="basket-product-item">${item.id}</div>
                   <div class="basket-product-item" data-id="${item.id}">
                      <div class="basket-product__name">${item.name}</div>
                   </div>
                   <div class="basket-product-item">
                      <input type="number" value="${item.counter}" data-input-card="card">
                   </div>
                   <div class="basket-product-item" data-card-price>${formatNumber(item.price)} руб.</div>
                   <div class="basket-product-item" data-basket-delete="delete">
                      <i class="fas fa-times" data-basket-delete="delete"></i>
                   </div>
                </div>
            `)

            return acc
        },[])
    }

    #renderCards() {

        if (this.#getCards().length) {
            return `
               <div class="basket-in-product">Товары в корзине</div>
                <div class="basket-product__items-inner">
                   <div class="basket-paramentrs__item">ID</div>
                   <div class="basket-paramentrs__item">Наименование</div>
                   <div class="basket-paramentrs__item">Кол-во</div>
                   <div class="basket-paramentrs__item">Сумма, руб.</div>
                   <div class="basket-paramentrs__item">
                      <i class="fas fa-times" ></i>
                   </div>
                </div>
                ${this.#getCards().join('')}
                <div class="basket__total-amount">
                    Итого: 
                   <span data-totalAmount>${this.#renderTotalAmount()} руб.</span> 
                </div>
            `
        }
        else {
            return `
                <div class="basket-empty">
                    Корзина пуста
                </div>
            `
        }
    }

    #renderTotalAmount() {
        return formatNumber(this.store.getState().sumTotal)
    }

    onChange(counter, id) {

        const item = searchItemID(this.DATA, id)
        this.store.dispath(INCREASE__PRICE(item, counter))

        const itemNew = this.store.getState().basket.find(item => +item.id === +id)

        const $item = this.$root.qSelector(`[data-idcard="${itemNew.id}"]`)
        $item
            .querySelector('[data-card-price]')
            .innerHTML = `${formatNumber(itemNew.price)} руб.`

        this.DOM.$totalAmount
                .innerHTML = `${formatNumber(this.store.getState().sumTotal)} руб.`

    }

    onClick(event) {

        const { basketDelete } = event.target.dataset

        if (basketDelete) {
            const id = event.target.closest('[data-idcard]').dataset.idcard

            const item = searchItemID(this.DATA, id)
            this.store.dispath(CARD__DELETE(item))

            const divWrap = this.$root.qSelector('[data-basket-wrap]')
            divWrap.innerHTML = this.#renderCards()

            this.emmiter.emit('LOGIN__BAR', true)
            this.emmiter.emit('HEADER__TOP', true)
        }
    }

}