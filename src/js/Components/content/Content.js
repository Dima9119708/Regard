import { ParentComponent } from "../../core/ParentComponent";
import { reSorting, sideBarHTML, accardion, brandsHTML, filterBrands, sideBarTAB } from './content-sideBar.functions'
import { $ } from "../../core/Dom";

export class Content extends ParentComponent {

  static className = 'container'
  static tagName = 'div'

  constructor($root, options) {
    super($root, {
      name: 'Content',
      listener : ['click'],
      options
    })

    this.DATA = options.DATA
  }

  init() {
    super.init()

    this.renderSideBar()
  }

  renderHTML() {
    return `
        <div class="content">
          <div class="content-wrap">
              <div class="content-product" data-lsideBar>
                    <div class="content-product-type" data-type>
                          <span class="tab tab--active" data-tab="tab" data-types="types" >По типам</span><span data-tab="tab" data-types="brand" class="tab">По брендам</span></div>
                          <ul class="content-product__menu" data-menuProduct>${this.renderSideBar()}</ul>
                          </div><main class="content-center">
      <section class="s-content__search"><div class="s-content__search-rel"><input class="s-content__input" type="text" placeholder="Поиск среди товаров"><div class="s-content__search-list"></div></div><button class="s-content__find" type="button">Найти</button></section><div class="content-wrapper"><div class="content-slider"><div class="swiper-container swiper-1 swiper-container-initialized swiper-container-horizontal"><div class="swiper-wrapper" style="transform: translate3d(-2880px, 0px, 0px); transition-duration: 0ms;"><div class="swiper-slide swiper-slide-duplicate swiper-slide-next swiper-slide-duplicate-prev" data-swiper-slide-index="1" style="width: 960px;"> <img src="./images/delivery6.jpg" alt="" srcset=""></div><div class="swiper-slide swiper-slide-duplicate-active" data-swiper-slide-index="0" style="width: 960px;"> <img src="./images/delivery6.jpg" alt="" srcset=""></div><div class="swiper-slide swiper-slide-prev swiper-slide-duplicate-next" data-swiper-slide-index="1" style="width: 960px;"> <img src="./images/delivery6.jpg" alt="" srcset=""></div><div class="swiper-slide swiper-slide-duplicate swiper-slide-active" data-swiper-slide-index="0" style="width: 960px;"> <img src="./images/delivery6.jpg" alt="" srcset=""></div></div><div class="swiper-pagination swiper-pag-1 swiper-pagination-clickable swiper-pagination-bullets"><span class="swiper-pagination-bullet swiper-pagination-bullet-active" tabindex="0" role="button" aria-label="Go to slide 1"></span><span class="swiper-pagination-bullet" tabindex="0" role="button" aria-label="Go to slide 2"></span></div><div class="swiper-button-prev swiper-prev-1" tabindex="0" role="button" aria-label="Previous slide"><i class="fas fa-arrow-circle-left"></i></div><div class="swiper-button-next swiper-next-1" tabindex="0" role="button" aria-label="Next slide"><i class="fas fa-arrow-circle-right"></i></div><span class="swiper-notification" aria-live="assertive" aria-atomic="true"></span></div></div><section class="s-content-products"><section class="s-content-foods"><div class="content-hits__top"><span>Хиты продаж </span><span>ТОП 40 продаж </span></div><div class="content-blocks"><div class="content-product-block"><div class="content-product-block-image"><div class="content-product-block-img">Фото</div><span>ID: 282525</span></div><div class="content-product-block-content"><div class="content-product-block-name">AMD Ryzen 5 2600 OEM</div><div class="content-product-block-dist">Socket AM4, 6-ядерный, 3400 МГц, Turbo: 3900 МГц, Pinnacle Ridge, Кэш L2 - 3 Мб, Кэш L3 - 16 Мб, 12 нм, 65 Вт</div><div class="content-product-block-price"><span><img src="./images/compare_icon.png" alt="" srcset=""></span><span><img src="./images/cart.png" alt="" srcset=""></span>8 890 руб</div></div></div></div><section class="s-content-foods__wrap"><section class="s-content-food__sentence"><div class="content-hits__top"><span>Предложение </span><span> </span></div><div class="content-blocks"><div class="content-product-block"><div class="content-product-block-image"><div class="content-product-block-img">Фото</div><span>ID: 282525</span></div><div class="content-product-block-content"><div class="content-product-block-name">AMD Ryzen 5 2600 OEM</div><div class="content-product-block-dist">Socket AM4, 6-ядерный, 3400 МГц, Turbo: 3900 МГц, Pinnacle Ridge, Кэш L2 - 3 Мб, Кэш L3 - 16 Мб, 12 нм, 65 Вт</div><div class="content-product-block-price"><span><img src="./images/compare_icon.png" alt="" srcset=""></span><span><img src="./images/cart.png" alt="" srcset=""></span>8 890 руб</div></div></div></div></section><section class="s-content-food__sentence"><div class="content-hits__top"><span>Новинки </span><span> </span></div><div class="content-blocks"><div class="content-product-block"><div class="content-product-block-image"><div class="content-product-block-img">Фото</div><span>ID: 282525</span></div><div class="content-product-block-content"><div class="content-product-block-name">AMD Ryzen 5 2600 OEM</div><div class="content-product-block-dist">Socket AM4, 6-ядерный, 3400 МГц, Turbo: 3900 МГц, Pinnacle Ridge, Кэш L2 - 3 Мб, Кэш L3 - 16 Мб, 12 нм, 65 Вт</div><div class="content-product-block-price"><span><img src="./images/compare_icon.png" alt="" srcset=""></span><span><img src="./images/cart.png" alt="" srcset=""></span>8 890 руб</div></div></div></div></section></section></section></section></div></main></div><div class="content-footer"><p>© 2000–2020. Сеть компьютерных магазинов "РЕГАРД". Многоканальная телефонная линия: (495) 921-41-58</p></div></div>
    `
  }

  renderSideBar() {

    let types = this.DATA.map(elem => elem.type); // сбор всех типов товара

    types = [...new Set(types)] // оставляем только уникальные названия

    const reSort = reSorting(types, this.DATA) // пересортировали массив в объект

    return sideBarHTML(reSort).join('')
  }

  renderBrand() {

    const filterBrand = filterBrands(this.DATA)

    let brands = filterBrand.map(elem => elem.producer);

    brands = [...new Set(brands)]

    return brandsHTML(brands)
  }

  onClick(event) {

    const sidebar = event.target.closest('[data-lsidebar]')

    if (sidebar) {

      const { goods, tab, types } = event.target.dataset

      if (goods) {
        accardion(event)
      }
      else if (tab) {

        sideBarTAB(event)

        const menu = this.$root.qSelector('[data-menuProduct]')

        if (types === 'types') {
          $(menu).clear().insertHTML('beforeend',this.renderSideBar())
        }
        else if (types === 'brand') {
          $(menu).clear().insertHTML('beforeend', this.renderBrand())
        }

      }
    }

  }
}
