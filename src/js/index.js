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
