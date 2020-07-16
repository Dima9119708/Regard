import { InitComponent } from '../Components/init/InitComponent'
import { HeaderTop } from '../Components/header-top/Header-top'
import { Header } from '../Components/header/Header'
import { Content } from '../Components/content/Content'
import { Footer } from '../Components/footer/Footer'
import { LoginBar } from '../Components/loginBar/LoginBar'
import { InterfacePages } from './InterfacePage'
import firebase from 'firebase/app'

function whetherTheUserIsSaved() {

  return new Promise(resolve => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        resolve(user)
      }
      else {
        resolve(user)
      }
    })
  });
}

export class MainPage extends InterfacePages {

  async render() {

    this.userLogin = null

    const GET__DATA = await fetch('https://regard-ab2be.firebaseio.com/base.json')
    const DATA = await GET__DATA.json()
    const user = await whetherTheUserIsSaved()

    if (user) {
      this.userLogin = user
    }

    this.initComponent = new InitComponent(
      [HeaderTop, Header, Content, Footer, LoginBar],
      DATA,
      this.userLogin
    )


    return this.initComponent.getRoot()
  }

  initListener() { this.initComponent.init() }

  destroy() { this.initComponent.destroy() }
}