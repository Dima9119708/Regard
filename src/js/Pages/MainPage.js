import { InitComponent } from '../Components/init/InitComponent'
import { HeaderTop } from '../Components/header-top/Header-top'
import { Header } from '../Components/header/Header'
import { Content } from '../Components/content/Content'
import { Footer } from '../Components/footer/Footer'
import { LoginBar } from '../Components/loginBar/LoginBar'
import { InterfacePages } from './InterfacePage'

import base from '../base.json'

export class MainPage extends InterfacePages {

  async render() {

    const DATA = await base

    this.initComponent = new InitComponent(
      [HeaderTop, Header, Content, Footer, LoginBar],
      DATA
    )

    return this.initComponent.getRoot()
  }

  initListener() { this.initComponent.init() }

  destroy() { this.initComponent.destroy() }
}