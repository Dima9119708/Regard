import { $ } from "./Dom"

export function preloader() {

  const preloader = $.create('div', 'main')
  preloader.setAttribute('data-preloader', true)
  preloader.innerHTML = `
    <header class="header">
      <div class="header-wrap"><a class="header__link" href="#">Конфигуратор ПК</a></div>
    </header>
    <div class="header-content">
      <div class="header-content__wrap">
         <div class="header-content_item"><img src="./images/logo.png" alt=""></div>
         <div class="header-content__contants header-content_item">
            <div class="header-content__phone header-content__phone-item">
               <div class="header-content__phones">

               </div>
               <div class="header-content__consult">
                  <div class="consult-1">Наличие, заказ, консультации</div>
                  <div>ПН–ПТ: 9:30 – 20:00</div>
                  <div>СБ–ВС: 10:00 – 17:00</div>
               </div>
            </div>
            <div class="header-content__point header-content__phone-item">
               <div class="point-1">Пункт выдачи заказов</div>
               <div class="closest-1">Временно закрыт</div>
            </div>
         </div>
         <div class="header-content_item">
            <div class="header-content__basket">
               <i class="fas fa-cart-arrow-down"></i>
               <div>В корзине <span>0 товаров</span></div>
               На сумму <span>0 р</span>
            </div>
         </div>
      </div>
   </div>
   <div class="container">
      <div class="content">
         <div class="content__preloader">
            <div class="lds-roller">
               <div></div>
               <div></div>
               <div></div>
               <div></div>
               <div></div>
               <div></div>
               <div></div>
               <div></div>
            </div>
         </div>
      </div>
   </div>

   <footer class="footer"></footer>
   <div class="loginbar">
      <span>Перейти в корзину (0 товаров, 0 руб.)</span>
    </div>
  `

  return preloader
}