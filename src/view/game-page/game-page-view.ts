import { ViewLoadable } from "../../util/viewLoadable";
import { GameSelectorInerfaceView } from "./game-selector-inerface/game-selector-interface-view";
import { GameFieldView } from "./game-field/game-field-view";
import { BottomPanelView } from "./bottom-panel/bottom-panel-view";
import { ElementParametrs } from "../../types/view-types";
import { Loader } from "../../loader/loader";
import { AppCashe } from "../../app-cashe/app-cashe";
import "./game-page-style.scss";

export class GamePageView extends ViewLoadable {
  gameSelectorInterface: GameSelectorInerfaceView;

  gameFieldView: GameFieldView;

  bottomPanelView: BottomPanelView;

  appCashe: AppCashe;

  constructor(params: ElementParametrs, appLoader: Loader, appCashe: AppCashe) {
    super(params, appLoader);
    this.appCashe = appCashe;
    this.gameFieldView = this.createGameFieldView();
    this.gameSelectorInterface = this.createGameSelectorInterfaceView();
    this.bottomPanelView = this.createBottomPanelView();
  }

  private createGameSelectorInterfaceView(): GameSelectorInerfaceView {
    const GAME_SELECTOR_PARAMS: ElementParametrs = {
      tag: "div",
      cssClasses: ["game-page__game-selector ", "game-selector"],
    };
    const gameSelectorInterface = new GameSelectorInerfaceView(
      GAME_SELECTOR_PARAMS,
      this.appLoader,
      this.appCashe,
      this.gameFieldView,
    );
    this.getHtmlElement().prepend(gameSelectorInterface.getHtmlElement());
    return gameSelectorInterface;
  }

  private createGameFieldView(): GameFieldView {
    const GAME_FIELD_PARAM: ElementParametrs = {
      tag: "div",
      cssClasses: ["game-page__game-field", "game-field"],
    };
    const GameField = new GameFieldView(
      GAME_FIELD_PARAM,
      this.appLoader,
      this.appCashe,
    );
    this.getHtmlElement().append(GameField.getHtmlElement());
    return GameField;
  }

  createBottomPanelView(): BottomPanelView {
    const BOTTOM_PANEL_PARAMS: ElementParametrs = {
      tag: "div",
      cssClasses: ["game-page__bottom-panel", "bottom-panel"],
    };
    const BottomPanel = new BottomPanelView(
      BOTTOM_PANEL_PARAMS,
      this.appLoader,
      this.gameFieldView,
      this.appCashe,
    );
    this.getHtmlElement().append(BottomPanel.getHtmlElement());
    return BottomPanel;
  }
}
