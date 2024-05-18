import { Loader } from "../loader/loader";
import { AppView } from "../view/app-view";
import { ElementParametrs } from "../types/view-types";
import { AppCashe } from "../app-cashe/app-cashe";

export class App {
  appLoader: Loader;

  view: AppView;

  appCashe: AppCashe;

  constructor() {
    this.appCashe = new AppCashe();
    this.appLoader = new Loader(this.appCashe);
    this.appLoader.loadFullData(
      String(this.appCashe.cashObject.level),
      String(this.appCashe.cashObject.round),
    );
    const APP_VIEW_PARAMS: ElementParametrs = {
      tag: "div",
      cssClasses: ["main-container"],
    };
    this.view = new AppView(APP_VIEW_PARAMS, this.appLoader, this.appCashe);
    document.body.append(this.view.getHtmlElement());
  }
}
