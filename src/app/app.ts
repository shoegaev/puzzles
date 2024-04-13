import { Loader } from "../loader/loader";
import { AppView } from "../view/app-view";
import { ElementParametrs } from "../types/view-types";

export class App {
  appLoader: Loader;

  view: AppView;

  constructor() {
    this.appLoader = new Loader();
    this.appLoader.loadLevelData("1");

    const APP_VIEW_PARAMS: ElementParametrs = {
      tag: "div",
      cssClasses: ["main-container"],
    };
    this.view = new AppView(APP_VIEW_PARAMS, this.appLoader);
    document.body.append(this.view.getHtmlElement());
  }
}
