import { reSotingDATA, } from "./content.functions"

import { renderTitle, checkLackOfGoods, renderProductCards, renderRandomContent } from "./renderContent.functions"
import { pagination } from "../../core/pagination"
import { searchMaxAndMinNumber } from "../../core/utils"
import { Filter } from "./filter"

export function renderMainContent(content) {
  return `

    <div class="content-slider">
    <div class="swiper-container swiper-1">
      <div class="swiper-wrapper">
          <div class="swiper-slide" >
            <img src="./images/delivery6.jpg" alt="" srcset="">
          </div>
          <div class="swiper-slide">
            <img src="./images/delivery6.jpg" alt="" srcset="">
          </div>
          <div class="swiper-slide" >
            <img src="./images/delivery6.jpg" alt="" srcset=""></div>
          <div class="swiper-slide">
              <img src="./images/delivery6.jpg" alt="" srcset="">
          </div>
      </div>
      <div class="swiper-pagination swiper-pag-1 swiper-pagination-bullets">
        <span class="swiper-pagination-bullet swiper-pagination-bullet-active"></span>
        <span class="swiper-pagination-bullet" ></span>
      </div>
      <div class="swiper-button-prev swiper-prev-1">
          <i class="fas fa-arrow-circle-left"></i>
      </div>
      <div class="swiper-button-next swiper-next-1">
          <i class="fas fa-arrow-circle-right"></i>
      </div>
      </div>
      </div>

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

  const { $root,DATA, store } = content
  let base = reSotingDATA(DATA)

  return {
    base: base,
    content: `
      <div class="content__blocks" >
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

            ${
              pagination.__INIT__(base)
            }
          </div>
        </div>
        <div class="content-block__filter unselectable">

            <div class="content-block__filter-header">Подбор по параметрам</div>
            <div class="content-block__filter-reset" data-reset="reset">Сбросить фильтры</div>
            <ul class="content-block__filter-list" data-simplebar>

              <li class="content-block__filter-item" data-accardion="true">
                <div class="content-block__filter-title" data-filterTittle="filterTittle">
                  <i class="fas fa-long-arrow-alt-right"></i>Цена, руб.
                </div>
                  <div class="content-block__filter-price" data-inputFilterParent>
                  <div class="input-price from">
                    от
                      <input type="number" data-minInput value="${searchMaxAndMinNumber(false, base)}" min="${searchMaxAndMinNumber(false, base)}">
                      </div>
                    <div class="input-price before">
                      до
                      <input type="number" data-maxInput value="${searchMaxAndMinNumber(true, base)}" max="${searchMaxAndMinNumber(true, base)}">
                      </div>
                    </div>

                    <div class="content__range-slider" data-rangeParent>

                      <button class="content__range-button" data-range="left"></button>
                      <button class="content__range-button" data-range="right"></button>
                      <div class="content__range-slider-line" data-rangeLine></div>

                    </div>
              </li>

              ${Filter.renderFilterContent(base)}


            </ul>
          </div>
    </div>
  `
  }
}
