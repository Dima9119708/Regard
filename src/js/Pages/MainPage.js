import { InitComponent } from '../Components/init/InitComponent'
import { HeaderTop } from '../Components/header-top/Header-top'
import { Header } from '../Components/header/Header'
import { Content } from '../Components/content/Content'
import { Footer } from '../Components/footer/Footer'
import { LoginBar } from '../Components/loginBar/LoginBar'
import { InterfacePages } from './InterfacePage'
import firebase from 'firebase/app'
import { initialState } from '../core/initialState'
import { storage } from '../core/utils'

import base from './../base.json'

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

function retrievingSpecificUserData(user) {
  return new Promise(resolve => {
    firebase
      .database()
      .ref(`users/${user.uid}/`)
      .on('value', function (dataSnapshot) {
        resolve(dataSnapshot.val())
      })
  })
}

export class MainPage extends InterfacePages {

  async render() {

    this.user = null

    // const GET__DATA = await fetch('https://regard-ab2be.firebaseio.com/base.json')
    // const DATA = await GET__DATA.json()
    //const user = await whetherTheUserIsSaved()
    const DATA = await base
    const user = false

    if (user) {
      this.user = user
      this.userState = await retrievingSpecificUserData(this.user)

      if (this.userState) {
        if (!this.userState.userDATA) {
          this.userState.userDATA = storage('REGARD') || initialState
        }
      }
      else {
        this.userState = storage('REGARD') || initialState
      }
    }
    else {
      this.userState = storage('REGARD') || initialState
    }

    this.initComponent = new InitComponent(
      [HeaderTop, Header, Content, Footer, LoginBar],
      DATA.base,
      this.userState,
      this.user
    )

    return this.initComponent.getRoot()
  }

  initListener() { this.initComponent.init() }

  destroy() { this.initComponent.destroy() }
}