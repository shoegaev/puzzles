import { ViewLoadable } from "../../util/viewLoadable";
import { GameSelectorInerfaceView } from "./game-selector-inerface/game-selector-interface-view";
import { GameFieldView } from "./game-field/game-field-view";
import { ElementParametrs } from "../../types/view-types";
import { Loader } from "../../loader/loader";
import "./game-page-style.scss";

export class GamePageView extends ViewLoadable {
  gameSelectorInterface: GameSelectorInerfaceView;

  gameFieldView: GameFieldView;

  constructor(params: ElementParametrs, appLoader: Loader) {
    super(params, appLoader);
    this.gameSelectorInterface = this.createGameSelectorInterfaceView();
    this.gameFieldView = this.createGameFieldView();
  }

  createGameSelectorInterfaceView(): GameSelectorInerfaceView {
    const GAME_SELECTOR_PARAMS: ElementParametrs = {
      tag: "div",
      cssClasses: ["game-page__game-selector ", "game-selector"],
    };
    const gameSelectorInterface = new GameSelectorInerfaceView(
      GAME_SELECTOR_PARAMS,
      this.appLoader,
    );
    this.getHtmlElement().append(gameSelectorInterface.getHtmlElement());
    return gameSelectorInterface;
  }

  createGameFieldView(): GameFieldView {
    const GAME_FIELD_PARAM: ElementParametrs = {
      tag: "div",
      cssClasses: ["game-page__game-field", "game-field"],
    };
    const GameField = new GameFieldView(GAME_FIELD_PARAM, this.appLoader);
    this.getHtmlElement().append(GameField.getHtmlElement());
    return GameField;
  }
}
