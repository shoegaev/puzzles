import { ViewLoadable } from "../util/viewLoadable";
import { ElementParametrs } from "../types/view-types";
import { GamePageView } from "./game-page/game-page-view";
import { Loader } from "../loader/loader";
import { AppCashe } from "../app-cashe/app-cashe";

export class AppView extends ViewLoadable {
  appCashe: AppCashe;

  gamePageView: GamePageView;

  constructor(params: ElementParametrs, appLoader: Loader, appCashe: AppCashe) {
    super(params, appLoader);
    this.appCashe = appCashe;
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
    const gamePage = new GamePageView(
      GAME_PAGE_PARAMS,
      this.appLoader,
      this.appCashe,
    );
    this.getHtmlElement().append(gamePage.getHtmlElement());
    return gamePage;
  }
}
