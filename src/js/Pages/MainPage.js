import { InitComponent } from '../Components/init/InitComponent'
import { HeaderTop } from '../Components/header-top/Header-top'
import { Header } from '../Components/header/Header'
import { Content } from '../Components/content/Content'
import { Footer } from '../Components/footer/Footer'
import { LoginBar } from '../Components/loginBar/LoginBar'
import { InterfacePages } from './InterfacePage'
import { initialState } from '../core/initialState'
import { storage } from '../core/utils'

import newBase from './../newBase.json'
import {DATABASE} from "../core/DATABASE";

export class MainPage extends InterfacePages {

  async render() {

    this.user = null

    //const DATA = await DATABASE.DATA()

    const DATA = await newBase
    const user = await DATABASE.whetherTheUserIsSaved()
    const reviews = await DATABASE.reviews()

    if (user) {
      this.user = user
      this.userState = await DATABASE.retrievingSpecificUserData(this.user)

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
      DATA,
      this.userState,
      this.user,
      reviews
      )

    return this.initComponent.getRoot()
  }

  initListener() { this.initComponent.init() }

  destroy() { this.initComponent.destroy() }
}