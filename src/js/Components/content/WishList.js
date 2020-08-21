import {ActiveRout} from "../../Routing/ActiveRouter";
import {changeURLWishList} from "../../core/urlHash.fn";
import {formatNumber, searchItemID} from "../../core/utils";
import {
    ADD__WISHLIST_ITEM,
    addBasket, CHANGE__GROUP__NAME,
    CREATE__WISHLIST__GROUP,
    DEFAULT__GROUP,
    DELETE__GROUP, DELETE__ITEM__GROUP
} from "../../core/redux/actions";
import {renderProductCards} from "./renderContent.functions";

export class WishList {

    constructor(Content) {
        this.content = Content
    }

    get DOM() {
        return {
            divGroupWrap : this.content.$root.qSelector('[data-wishList-group]')
        }
    }

    openPage(event) {

        const { gotowishlist } = event.target.dataset

        if (gotowishlist === 'true') {
            ActiveRout.setHash(changeURLWishList())
            this.content.reRenderHTML()
        }
    }

    addWishListCard(event) {

        const { addwishlist } = event.target.dataset

        if (addwishlist)  {

            const { id } = event.target.closest('[data-id]').dataset
            const $item = event.target

            if(addwishlist === 'true') {

               const item = searchItemID(this.content.DATA, id)

               $item.setAttribute('data-addwishlist', false)
               $item.setAttribute('data-goToWishList', true)
               $item.title = 'Перейти в список желаемого'

               $item.style.color = '#e18c0e'

               this.content.store.dispath(ADD__WISHLIST_ITEM(item))
               this.content.emmiter.emit('HEADER__TOP', true)
            }
        }
    }

    renderHTML() {
        return this.renderWishListGroups()
    }

    renderWishListGroups() {

        const wishListGroups = this.content.store.getState().wishListGroups || {}
        const currentGroup = this.content.store.getState().currentWishList || 0

        return Object.keys(wishListGroups).reduce((acc, item) => {

            wishListGroups[item].items = wishListGroups[item].items || []

            function testForEmptiness(Content, renderTotalCost) {

                if (!renderProductCards(wishListGroups[item].items, Content).length) {
                    return ` 
                        <div 
                          class="content__groups-item-inner" 
                          data-groups-item-inner
                          style="
                          justify-content: center;
                          align-items: center;
                          "
                          >
                           Группа пустая
                        </div>
                       `
                }

                return `
                    <div 
                      class="content__groups-item-inner"
                      style="font-size: 18px;"
                      data-groups-item-inner
                      >
                      ${renderProductCards(wishListGroups[item].items, Content)}
                    </div>
                    <div class="content__groups-item-total-amount">
                        Итого:
                        <span>${renderTotalCost(wishListGroups[item].items)} руб.</span>
                    </div>
                 `
            }

            acc.push(`
               <div class="content__groups-item" data-wishList-id="${item}">
                   
               <div class="content__groups-item-title">
               
                  <div class="content__groups-item-title-input">
                      <input type="text" value="${wishListGroups[item].name}" data-input>
                  </div>
                  
                  <div class="content__groups-item-title-icons">
                      <i 
                      class="fas fa-scroll"
                      title="Сохранить измененное название группы"
                      data-change-title-group="group"
                      >
                      </i>
                      <i 
                      class="far fa-check-square" title="Группа по умолчанию"
                      style="
                      color: ${currentGroup === item ? '#00FF00' : '#FFFFFF'} 
                      "
                      data-group-default="default"
                      >
                      </i>
                      
                      <i 
                      class="fas fa-cart-plus" 
                      title="Переместить в корзину"
                      data-moving-to-trash="trash"
                      > 
                      </i>
                      
                      <i 
                      class="fas fa-trash" 
                      title="Удалить группу"
                      data-delete-group="group"
                      >
                      </i>
                  </div>
                   
               </div>
               
               ${testForEmptiness(this.content, this.renderTotalCost.bind(this))}
            
             </div>
            `)

            return acc
        }, []).join('')
    }

    renderTotalCost(items) {
        return formatNumber(items.reduce( (acc, item) => acc + +item.price, 0))
    }

    onClick(event) {

        const { createGroup,
                groupDefault,
                deleteGroup,
                movingToTrash,
                changeTitleGroup,
                deleteCard
        } = event.target.dataset

        if (createGroup) {
            let { value } = this.content.$root.qSelector('[data-create-group-input]')

            value = value || 'Новая группа'

            this.content.store.dispath(CREATE__WISHLIST__GROUP(value))
            this.DOM.divGroupWrap.innerHTML = this.renderWishListGroups()
        }

        if (groupDefault) {
            const { wishlistId } = event.target.closest('[data-wishlist-id]').dataset
            const currentID = this.content.store.getState().currentWishList

            if (currentID !== wishlistId) {
                this.content.store.dispath(DEFAULT__GROUP(wishlistId))
                this.DOM.divGroupWrap.innerHTML = this.renderWishListGroups()
            }
        }
        else if (deleteGroup) {
            const $parent =  event.target.closest('[data-wishlist-id]')
            const { wishlistId } = event.target.closest('[data-wishlist-id]').dataset

            console.log($parent)

            const items = Array.from($parent.querySelector('[data-groups-item-inner]').children)
                            .reduce((acc,item) => {
                                acc.push(item.dataset.id)
                                return acc
                            }, [])

            this.content.store.dispath(DELETE__GROUP(wishlistId, items))
            this.DOM.divGroupWrap.innerHTML = this.renderWishListGroups()
            this.content.emmiter.emit('HEADER__TOP', true)
        }
        else if (movingToTrash) {
            const $parent =  event.target.closest('[data-wishlist-id]')

            Array
                .from($parent.querySelector('[data-groups-item-inner]').children)
                .reduce((acc,item) => {

                    const goToBasket = item.querySelector('[data-gotobasket="false"]')

                    if (goToBasket) {
                        acc.push(item.dataset.id)
                    }

                    return acc
                }, [])
                .reduce((acc,item) => {

                    this.content.DATA.forEach(elem => {

                        if (+item === +elem.id) {
                            acc.push(elem)
                        }
                    })

                    return acc
                }, [])
                .forEach(item => {
                    this.content.store.dispath(addBasket(item,+item.price, 1))
                },)

            this.DOM.divGroupWrap.innerHTML = this.renderWishListGroups()
        }
        else if (changeTitleGroup) {

            const { wishlistId } = event.target.closest('[data-wishlist-id]').dataset
            let { value } = event.target
                                .closest('[data-wishlist-id]')
                                .querySelector('[data-input]')

            const currentNameGroup = this.content
                                           .store.getState()
                                           .wishListGroups[wishlistId].name

            if (value.trim() === '') {
                value = 'Новая группа'
            }

            if (currentNameGroup !== value) {
                this.content.store.dispath(CHANGE__GROUP__NAME(value, wishlistId))
                this.DOM.divGroupWrap.innerHTML = this.renderWishListGroups()
            }
        }
        else if (deleteCard) {
            const { wishlistId } = event.target.closest('[data-wishlist-id]').dataset
            const { id } = event.target.closest('[data-id]').dataset

            this.content.store.dispath(DELETE__ITEM__GROUP(wishlistId, id))
            this.DOM.divGroupWrap.innerHTML = this.renderWishListGroups()
        }
    }
}