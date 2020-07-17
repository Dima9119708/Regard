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
                  <div><span>800 </span>444-42-44</div>
                  <div><span>999</span>333-60-58</div>
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
               <div>В корзине <span> Ожидание...</span></div>
               На сумму<span> Ожидание...</span>
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
      <span>Перейти в корзину ( Ожидание... )</span>
    </div>
  `

  return preloader
}