import { renderRandomContent,
        reSotingDATA,
        renderProductCards,
      } from "./content.functions"

import { renderTitle, lackOfGoods } from "./renderContent.functions"
import { pagination, showItems, pageTransitionAnimationSpeed } from "../../core/pagination"
import { searchMaxAndMinNumber } from "../../core/utils"
import { $ } from "../../core/Dom"
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

    <section class="s-content-products">
    <section class="s-content-foods">
    <div class="content-hits__top">
      <span>Хиты продаж </span>
    </div>

    <div class="content-blocks">
      <div class="content-blocks__inner" data-cards>
        ${renderRandomContent(10, content)}
      </div>
    </div>

    <section class="s-content-foods__wrap">
    <section class="s-content-food__sentence">
      <div class="content-hits__top"><span>Предложение </span><span> </span></div>
      <div class="content-blocks">
        <div class="content-blocks__inner" data-cards>
          ${renderRandomContent(5, content)}
        </div>
      </div>
    </section>
    <section class="s-content-food__sentence">
    <div class="content-hits__top">
      <span>Новинки</span>
    </div>
    <div class="content-blocks">
      <div class="content-blocks__inner" data-cards>
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
      <section class= "s-content-products" >
        <section class="s-content-foods">
          <div class="content-hits__top">
            <h2 data-titleSearch>${renderTitle()}</h2>
          </div>

          <div class="content-blocks">
            <div class="content-blocks__sorting" data-sort>
              Сортировать по :
              <button class="price price--active" data-price="price" data-value="" data-paginationitem="0" data-paginationnumber="1"> по умолчанию</button>
              <button class="price" data-price="price" data-value="a-b" data-paginationitem="0" data-paginationnumber="1"> по возрастанию</button>
              <button class="price" data-price="price" data-value="b-a" data-paginationitem="0" data-paginationnumber="1"> по убыванию</button>
            </div>
            <div class="content-blocks__inner" data-cards>
              ${
                renderProductCards(pagination.showItems(base), store)
                ||
                lackOfGoods(
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
        </section>
        <div class="content-products-filter unselectable">
          <div class="content-products-filter__header">Подбор по параметрам</div>
          <div class="content-products-filter__reset">Сбросить фильтры</div>
          <ul class="content-products-filter__list">

            <li class="content-products-filter__item" data-accardion="true">
              <div class="content-products-filter__item-title" data-filterTittle="filterTittle">
                <i class="fas fa-long-arrow-alt-right"></i>Цена, руб.
              </div>
                <div class="content-products-filter__price" data-inputFilterParent>
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
          <div class="content-products-filter__reset">
            Применить фильтры <span>Найдено товаров 5</span>
          </div>
       </div>
    </section>
  `
  }
}

export function renderCards(event, $root, DATA, store) {

  const { paginationitem } = event.target.dataset

  const start = +paginationitem
  const finish = start + (showItems)

  const newBase = DATA.slice(start, finish)

  const $element = $root.qSelector('[data-cards]')

  $element.style.opacity = '.40'
  $element.style.transition = 'opacity .2s linear'

  setTimeout(() => {

    $element.style.opacity = '1'
    $element.style.transition = 'opacity .2s linear'
    $($element)
      .clear()
      .insertHTML('beforeend', renderProductCards(newBase, store))

  }, pageTransitionAnimationSpeed)
}
