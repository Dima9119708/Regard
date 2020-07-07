import { ParentComponent } from "../../core/ParentComponent";
import { Sidebar } from "./Sidebar";
import { Search } from "./Search";
import { renderRandomContent, addBasketProducts } from "./content.functions";

export class Content extends ParentComponent {

  static className = 'container'
  static tagName = 'div'

  constructor($root, options) {
    super($root, {
      name: 'Content',
      listener: ['click', 'input', 'keydown'],
      ...options
    })
  }

  prepare() {
    this.sideBar = new Sidebar(this)
    this.search = new Search(this)
  }

  init() {
    super.init()
  }

  renderHTML() {
    return `
        <div class="content">
          <div class="content-wrap">
              <div class="content-product" data-lsideBar>
                    <div class="content-product-type" data-type>
                          <button class="tab tab--active" type="button" data-tab="tab" data-types="types">По типам</button><button class="tab" type="button" data-tab="tab" data-types="brand" >По брендам</button></div>
                          <ul class="content-product__menu" data-menuProduct>${this.sideBar.renderSideBar()}</ul>
                          </div><main class="content-center">
      <section class="s-content__search">
      <div class="s-content__search-rel" data-search-rel>
      <input class="s-content__input" type="text" data-search="search" placeholder="Поиск среди товаров">
      <div class="s-content__search-list" data-search-list="search-list">
          <div class="s-content__search-list-item" data-historyLi>
            История поиска
           ${this.search.searchHistory()}
          </div>
          <div class="s-content__search-list-item" data-search-list-item="false">
            Введите модель в поиск
          </div>
      </div>
      </div>
      <button class="s-content__find" data-searchButton="search" type="search">Найти</button></section><div class="content-wrapper"><div class="content-slider"><div class="swiper-container swiper-1 swiper-container-initialized swiper-container-horizontal"><div class="swiper-wrapper" style="transform: translate3d(-2880px, 0px, 0px); transition-duration: 0ms;"><div class="swiper-slide swiper-slide-duplicate swiper-slide-next swiper-slide-duplicate-prev" data-swiper-slide-index="1" style="width: 960px;"> <img src="./images/delivery6.jpg" alt="" srcset=""></div><div class="swiper-slide swiper-slide-duplicate-active" data-swiper-slide-index="0" style="width: 960px;"> <img src="./images/delivery6.jpg" alt="" srcset=""></div><div class="swiper-slide swiper-slide-prev swiper-slide-duplicate-next" data-swiper-slide-index="1" style="width: 960px;"> <img src="./images/delivery6.jpg" alt="" srcset=""></div><div class="swiper-slide swiper-slide-duplicate swiper-slide-active" data-swiper-slide-index="0" style="width: 960px;"> <img src="./images/delivery6.jpg" alt="" srcset=""></div></div><div class="swiper-pagination swiper-pag-1 swiper-pagination-clickable swiper-pagination-bullets"><span class="swiper-pagination-bullet swiper-pagination-bullet-active" tabindex="0" role="button" aria-label="Go to slide 1"></span><span class="swiper-pagination-bullet" tabindex="0" role="button" aria-label="Go to slide 2"></span></div><div class="swiper-button-prev swiper-prev-1" tabindex="0" role="button" aria-label="Previous slide"><i class="fas fa-arrow-circle-left"></i></div><div class="swiper-button-next swiper-next-1" tabindex="0" role="button" aria-label="Next slide"><i class="fas fa-arrow-circle-right"></i></div><span class="swiper-notification" aria-live="assertive" aria-atomic="true"></span></div></div><section class="s-content-products"><section class="s-content-foods">
      <div class="content-hits__top"><span>Хиты продаж </span><span>ТОП 40 продаж </span></div>

      <div class="content-blocks"> ${renderRandomContent(10, this)}</div>

      <section class="s-content-foods__wrap">
      <section class="s-content-food__sentence">
        <div class="content-hits__top"><span>Предложение </span><span> </span></div>
        <div class="content-blocks"> ${renderRandomContent(5, this)}</div>
      </section>
      <section class="s-content-food__sentence">
      <div class="content-hits__top"><span>Новинки </span><span> </span></div>
      <div class="content-blocks">
        ${renderRandomContent(5, this)}
      </section>
      </section>
      </section>
      </section>
      </div>
      </main>
      </div>

      <div class="content-footer">
      <p>© 2000–2020. Сеть компьютерных магазинов "РЕГАРД". Многоканальная телефонная линия: (495) 921-41-58</p></div></div>
    `
  }

  onClick(event) {
    this.sideBar.eventClick(event)
    this.search.eventClick(event)


    addBasketProducts(event, this)
  }

  onKeydown(event) {
    this.sideBar.eventKeyBoard(event)
    this.search.eventKeyBoard(event)
  }

  onInput(event) {
    this.search.eventInput(event)
  }
}
