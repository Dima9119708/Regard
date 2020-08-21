import {ActiveRout} from "../../Routing/ActiveRouter";
import {changeURLWishList} from "../../core/urlHash.fn";
import {formatNumber, searchItemID} from "../../core/utils";
import {
    ADD__WISHLIST_ITEM,
    addBasket,
    CREATE__WISHLIST__GROUP,
    DEFAULT__GROUP,
    DELETE__GROUP
} from "../../core/redux/actions";
import {Content} from "./Content";
import {renderProductCards} from "./renderContent.functions";
import {DELETE__GROUP__ITEM} from "../../core/redux/constans";

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

            acc.push(`
               <div class="content__groups-item" data-wishList-id="${item}">
                   
               <div class="content__groups-item-title">
               
                  <div class="content__groups-item-title-input">
                      <input type="text" value="${wishListGroups[item].name}">
                  </div>
                  
                  <div class="content__groups-item-title-icons">
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
               
               <div class="content__groups-item-inner" data-groups-item-inner>
                  ${renderProductCards(wishListGroups[item].items, this.content) || 'Группа пустая'}

               </div>
               <div class="content__groups-item-total-amount">
                   Итого:
                   <span>${this.renderTotalCost(wishListGroups[item].items)} руб.</span> 
               </div>
            
             </div>
            `)

            return acc
        }, []).join('')
    }

    renderTotalCost(items) {
        return formatNumber(items.reduce( (acc, item) => acc + +item.price, 0))
    }

    onClick(event) {

        const { createGroup, groupDefault, deleteGroup,movingToTrash } = event.target.dataset

        if (createGroup) {
            let { value } = this.content.$root.qSelector('[data-create-group-input]')

            value = value || 'Новая группа'

            this.content.store.dispath(CREATE__WISHLIST__GROUP(value))
            this.DOM.divGroupWrap.innerHTML = this.renderWishListGroups()
        }

        if (groupDefault) {
            const { wishlistId } = event.target.closest('[data-wishlist-id]').dataset

            this.content.store.dispath(DEFAULT__GROUP(wishlistId))
            this.DOM.divGroupWrap.innerHTML = this.renderWishListGroups()
        }
        else if (deleteGroup) {
            const $parent =  event.target.closest('[data-wishlist-id]')
            const { wishlistId } = event.target.closest('[data-wishlist-id]').dataset

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
    }
}