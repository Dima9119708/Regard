import { reSotingDATA, } from "./content.functions"

import { renderTitle, checkLackOfGoods, renderProductCards, renderRandomContent } from "./renderContent.functions"
import { pagination } from "../../core/pagination"
import { Filter } from "./filter"

export function renderMainContent(content) {
  return `

    <section class="content__blocks">
    <section class="content__foods">
      <div class="content-hits__top">
        <span>Хиты продаж </span>
      </div>

      <div class="content-block__cards">
        <div class="content-block__cards-inner" data-cards>
          ${renderRandomContent(10, content)}
        </div>
      </div>

    <section class="s-content-foods__wrap">
    <section class="s-content-food__sentence">
      <div class="content-hits__top">
        <span>Предложение </span><span> </span>
      </div>
      <div class="content-block__cards">
        <div class="content-block__cards-inner" data-cards>
          ${renderRandomContent(5, content)}
        </div>
      </div>
    </section>
    <section class="s-content-food__sentence">
    <div class="content-hits__top">
      <span>Новинки</span>
    </div>
    <div class="content-block__cards">
      <div class="content-block__cards-inner" data-cards>
        ${renderRandomContent(5, content)}
      </div>
    </section>
    </section>
    </section>
    </section>

  `
}

export function renderCatalogContent(Content) {

  const { DATA } = Content
  Content.filterCards = reSotingDATA(DATA)

  return `

      <div class="content__filter-button-inner">
        <button type="button" class="filter__button" data-filter-mobile-button="false">Фильтр</button>
      </div>
      <div class="content-block__filter-mobile" data-content-block__filter-mobile="true"></div>

      <div class="content__blocks" id="#bazinga">
        <div class="content__foods">
          <div class="content-hits__top">
            <h2 data-titleSearch>${renderTitle()}</h2>
          </div>

          <div class="content-block__cards">
            <div class="content-block__cards-sorting" data-sort>
              Сортировать по :
              <button class="price" data-price="true" data-value="default"> по умолчанию</button>
              <button class="price" data-price="price" data-value="a--b"> по возрастанию</button>
              <button class="price" data-price="price" data-value="b--a"> по убыванию</button>
            </div>
            <div class="content-block__cards-inner" data-cards>
              ${
                renderProductCards(pagination.showItems(Content.filterCards), Content)
                ||
                checkLackOfGoods(
                  Content.filterCards,
                  pagination.showItems(Content.filterCards),
                  renderProductCards(pagination.showItems(Content.filterCards), Content)
                )
              }
            </div>
          </div>

          <div class="content-blocks__pagination" data-pagination>
            ${ pagination.__INIT__(Content.filterCards) }
          </div>
        </div>
        ${Filter.renderHTML(Content.filterCards)}
    </div>
  `
}

export function renderCard(Card) {

  return `
    ${Card.renderHTML()}
  `
}

export function renderBasket(Basket) {

    return `
       <div class="s-content-products">
           <div class="content__foods">
               <div class="content-hits__top">
                <span>Корзина </span>
               </div>
               <div class="content-blocks basket" data-basket-wrap>
               
                    ${Basket.renderHTML()}

               </div>
               
           </div>
        </div>
    `
}

export function renderWishList(WishList) {

    return `
      <div class="s-content-products">
           <div class="content__foods">
               <div class="content-hits__top">
                <span>Список желаемого </span>
               </div>
               <div class="content__create-group">
               
                  <div class="content__create-group-input">
                    <input type="text" value="Новая группа" data-create-group-input>
                  </div>
                  <div class="content__create-group-icon" title="Создать группу" data-create-group="group">
                    <i class="fas fa-folder-plus" data-create-group="group"></i>
                  </div>
                  
               </div>

               <div class="content__groups" data-wishList-group>
                  
                 ${WishList.renderHTML()}

               </div>
           </div>
      </div>
    `
}
