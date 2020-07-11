import { renderRandomContent,
        reSotingDATA__url,
        renderProductCards,
      } from "./content.functions"

import { titleSearch, errorSRT } from "./renderContent.functions"
import { pagination } from "../../core/pagination"


export function renderMainContent(content) {
  return `

    <div class="content-slider">
    <div class="swiper-container swiper-1 swiper-container-initialized swiper-container-horizontal"><div class="swiper-wrapper" style="transform: translate3d(-2880px, 0px, 0px); transition-duration: 0ms;"><div class="swiper-slide swiper-slide-duplicate swiper-slide-next swiper-slide-duplicate-prev" data-swiper-slide-index="1" style="width: 960px;"> <img src="./images/delivery6.jpg" alt="" srcset=""></div><div class="swiper-slide swiper-slide-duplicate-active" data-swiper-slide-index="0" style="width: 960px;"> <img src="./images/delivery6.jpg" alt="" srcset=""></div><div class="swiper-slide swiper-slide-prev swiper-slide-duplicate-next" data-swiper-slide-index="1" style="width: 960px;"> <img src="./images/delivery6.jpg" alt="" srcset=""></div><div class="swiper-slide swiper-slide-duplicate swiper-slide-active" data-swiper-slide-index="0" style="width: 960px;"> <img src="./images/delivery6.jpg" alt="" srcset=""></div></div><div class="swiper-pagination swiper-pag-1 swiper-pagination-clickable swiper-pagination-bullets"><span class="swiper-pagination-bullet swiper-pagination-bullet-active" tabindex="0" role="button" aria-label="Go to slide 1"></span><span class="swiper-pagination-bullet" tabindex="0" role="button" aria-label="Go to slide 2"></span></div><div class="swiper-button-prev swiper-prev-1" tabindex="0" role="button" aria-label="Previous slide"><i class="fas fa-arrow-circle-left"></i></div><div class="swiper-button-next swiper-next-1" tabindex="0" role="button" aria-label="Next slide"><i class="fas fa-arrow-circle-right"></i></div><span class="swiper-notification" aria-live="assertive" aria-atomic="true"></span></div></div><section class="s-content-products"><section class="s-content-foods">
    <div class="content-hits__top"><span>Хиты продаж </span><span>ТОП 40 продаж </span></div>

    <div class="content-blocks"> ${renderRandomContent(10, content)}</div>

    <section class="s-content-foods__wrap">
    <section class="s-content-food__sentence">
      <div class="content-hits__top"><span>Предложение </span><span> </span></div>
      <div class="content-blocks"> ${renderRandomContent(5, content)}</div>
    </section>
    <section class="s-content-food__sentence">
    <div class="content-hits__top"><span>Новинки </span><span> </span></div>
    <div class="content-blocks">
      ${renderRandomContent(5, content)}
    </section>
    </section>
    </section>
    </section>

  `
}

export function renderCatalogContent(content) {

  const { $root, DATA, store } = content

  const base = reSotingDATA__url(DATA)

  pagination.eventClick($root,base, store)

  return `
    <section class="s-content-products">
        <section class="s-content-foods">
            <div class="content-hits__top">
                <span data-titleSearch>${titleSearch()} </span><span></span></div>

            <div class="content-blocks" data-cards>
            <div class="content-blocks__sorting">Сортировать по : <span>по цене</span></div>
             ${
              renderProductCards(pagination.showItems(base), store)
              ||
                errorSRT(
                  base,
                  pagination.showItems(base),
                  renderProductCards(pagination.showItems(base), store)
                )
              }
            </div>

            <div class="content-blocks__pagination" data-pagination>

            ${
              pagination.__INIT__(base)
            }

            </div></></section><div class="content-products-filter"><div class="content-products-filter__header">Подбор по параметрам</div><div class="content-products-filter__reset">Сбросить фильтры</div><ul class="content-products-filter__list"><li class="content-products-filter__item"> <i class="fas fa-long-arrow-alt-right"></i>Цена, руб.<div class="content-products-filter__price"><div class="input-price from">от<input type="number" value="2940"></div><div class="input-price before">до<input type="number" value="133550"></div></div></li></ul><div class="content-products-filter__reset">Применить фильтры<span>Найдено товаров 5</span></div></div></section>

  `
}
