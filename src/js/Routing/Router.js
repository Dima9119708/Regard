import { $ } from "../core/Dom"
import { preloader } from "../core/preloader"

export class Router {

  constructor($selector, pages) {
    this.$selector = $($selector)
    this.pages = pages
    this.preloader = preloader

    this.init()
  }

  init() {
    this.renderPage()
  }

  async renderPage() {

    const Page = this.pages.main

    this.$selector.clear().appendNode(this.preloader())

    const page = new Page()

    const renderHTML = await page.render()

    this.$selector.clear().appendNode(renderHTML)
    page.initListener()
  }
}