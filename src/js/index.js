import '@babel/polyfill'
import '../sass/main.scss'
import smoothscroll from 'smoothscroll-polyfill';
smoothscroll.polyfill();

import { Router } from './Routing/Router'
import { MainPage } from './Pages/MainPage'
import {DATABASE} from "./core/DATABASE";

DATABASE.__INIT__()

new Router('#app', {
  main: MainPage
})
