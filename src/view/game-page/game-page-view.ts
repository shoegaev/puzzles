import { View } from "../../util/view";
import { ViewLoadable } from "../../util/viewLoadable";
import { GameSelectorInerfaceView } from "./game-selector-inerface/game-selector-interface-view";
import { ElementParametrs } from "../../types/view-types";
import { Loader } from "../../loader/loader";

export class GamePageView extends ViewLoadable {
  constructor(params: ElementParametrs, appLoader: Loader) {
    super(params, appLoader);
    this.createLevelSelectorView();
  }

  createLevelSelectorView(): void {
    const GAME_SELECTOR_PARAMS = {
      tag: "div",
      cssClasses: ["game-page__game-selector ", "game-selector"],
    };
    const levelSelector = new GameSelectorInerfaceView(
      GAME_SELECTOR_PARAMS,
      this.appLoader,
    );
    this.getHtmlElement().append(levelSelector.getHtmlElement());
  }
}
