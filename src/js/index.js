import '@babel/polyfill'
import '../sass/main.scss'

import firebase from 'firebase/app'
import "firebase/auth";
import "firebase/database";
import smoothscroll from 'smoothscroll-polyfill';
smoothscroll.polyfill();

import { Router } from './Routing/Router'
import { MainPage } from './Pages/MainPage'

firebase.initializeApp({
  apiKey: "AIzaSyCOOBwnyg2X4AwOCwobaMjOBx5386lex0k",
  authDomain: "client-base-regard.firebaseapp.com",
  databaseURL: "https://client-base-regard.firebaseio.com",
  projectId: "client-base-regard",
  storageBucket: "client-base-regard.appspot.com",
  messagingSenderId: "725206410086",
  appId: "1:725206410086:web:6a66e94c39e5b6ea7d1ea7"
});

new Router('#app', {
  main: MainPage
})

// `
// <div class="content-hits__top">
//    <span>Корзина </span>
// </div>
// <div class="content-blocks basket">
//    <!-- .basket-empty В корзине нет товаров.-->
//    <div class="basket-in-product">Товары в корзине</div>
//    <div class="basket-paramentrs">
//       <div class="basket-paramentrs__item">ID</div>
//       <div class="basket-paramentrs__item">Наименование</div>
//       <div class="basket-paramentrs__item">Цена, руб.</div>
//       <div class="basket-paramentrs__item">Кол-во</div>
//       <div class="basket-paramentrs__item">Сумма, руб.</div>
//       <div class="basket-paramentrs__item"> <i class="fas fa-times"></i></div>
//    </div>
//    <div class="basket-product">
//       <div class="basket-product-item">1100904\t</div>
//       <div class="basket-product-item">
//          <div class="basket-product__name">PATRIOT PG 160</div>
//       </div>
//       <div class="basket-product-item">1320</div>
//       <div class="basket-product-item"><input type="number" value="1"></div>
//       <div class="basket-product-item">1320</div>
//       <div class="basket-product-item"><i class="fas fa-times"></i></div>
//    </div>
// </div>
//
// `