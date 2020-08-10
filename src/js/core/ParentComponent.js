import { DomListener } from "./DomListener";
import { ActiveRout } from "../Routing/ActiveRouter";
import { catalog } from "./urlHash.fn";
import { renderCatalogContent, renderMainContent } from "../Components/content/renderContent";
import { accardionObjectTrue } from "../Components/content/renderContent.functions";
import { Sidebar } from "../Components/content/Sidebar";
import { $ } from "./Dom";

export class ParentComponent extends DomListener {

  constructor($root, options) {
    super($root, options || {})

    this.store = options.store
    this.DATA = options.DATA
    this.emmiter = options.emmiter
    this.user = options.user

    this.prepare()
  }

  prepare() {
    this.sideBar = new Sidebar(this)
  }

  init() {
    super.listener()
  }


  destroy() {
    super.destroy()
  }
}