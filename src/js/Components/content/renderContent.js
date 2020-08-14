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

export function renderCatalogContent(content) {

  const { DATA, store } = content
  let base = reSotingDATA(DATA)

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
                renderProductCards(pagination.showItems(base), store)
                ||
                checkLackOfGoods(
                  base,
                  pagination.showItems(base),
                  renderProductCards(pagination.showItems(base), store)
                )
              }
            </div>
          </div>

          <div class="content-blocks__pagination" data-pagination>
            ${ pagination.__INIT__(base) }
          </div>
        </div>
        ${Filter.renderHTML(base)}
    </div>
  `
}

export function renderCard(card) {

  return `
    <div class="goods">
    ${card.renderHTML()}
    </div>
  `
}