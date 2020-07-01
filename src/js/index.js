import '@babel/polyfill'
import '../sass/main.scss'

import { Router } from './Routing/Router'
import { MainPage } from './Pages/MainPage'


new Router('#app', {
  main : MainPage
})

// <li class="content-product__menu-item" > ${ item } <span>+</span>
//   <ul class="content-product__menu-internal" data-type="${item}">
//     <li class="content-product__menu-internal-item">все товары раздела</li>
//     <li class="content-product__menu-internal-item"> ${ elem } </>
//   </ul>
// </li>