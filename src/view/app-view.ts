import { ViewLoadable } from "../util/viewLoadable";
import { ElementParametrs } from "../types/view-types";
import { GamePageView } from "./game-page/game-page-view";
import { Loader } from "../loader/loader";

export class AppView extends ViewLoadable {
  gamePageView: GamePageView;

  constructor(params: ElementParametrs, appLoader: Loader) {
    super(params, appLoader);
    this.addInnerElementsParams();
    this.addInnerElements();
    this.gamePageView = this.createGamePageView();
  }

  private addInnerElementsParams(): void {
    this.innerElementsParams = [
      {
        tag: "div",
        cssClasses: ["modal-backdrop"],
      },
    ];
  }

  createGamePageView(): GamePageView {
    const GAME_PAGE_PARAMS: ElementParametrs = {
      tag: "main",
      cssClasses: ["game-page"],
    };
    const gamePage = new GamePageView(GAME_PAGE_PARAMS, this.appLoader);
    this.getHtmlElement().append(gamePage.getHtmlElement());
    return gamePage;
  }
}
