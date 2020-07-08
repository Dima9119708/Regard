import '@babel/polyfill'
import '../sass/main.scss'

import { Router } from './Routing/Router'
import { MainPage } from './Pages/MainPage'


new Router('#app', {
  main : MainPage
})