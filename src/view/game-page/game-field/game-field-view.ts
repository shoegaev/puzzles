import { ViewLoadable } from "../../../util/viewLoadable";
import { ElementParametrs } from "../../../types/view-types";
import { Loader } from "../../../loader/loader";
import { ResultPanelView } from "./result-panel/result-panel-view";
import { WordsPanelView } from "./words-panel/words-panel";
import "./game-field-style.scss";

export class GameFieldView extends ViewLoadable {
  resultPanelView: ResultPanelView;

  wordsPanelView: WordsPanelView;

  constructor(params: ElementParametrs, appLoader: Loader) {
    super(params, appLoader);
    this.resultPanelView = this.createResultPanel();
    this.wordsPanelView = this.createWordsPanel();
  }

  createResultPanel(): ResultPanelView {
    const RESULT_PANEL_PARAMS: ElementParametrs = {
      tag: "div",
      cssClasses: ["game-field__result-panel", "result-panel"],
    };
    const resultPanel = new ResultPanelView(
      RESULT_PANEL_PARAMS,
      this.appLoader,
    );
    this.getHtmlElement().append(resultPanel.getHtmlElement());
    return resultPanel;
  }

  createWordsPanel(): WordsPanelView {
    const WORDS_PANEL_PARAMS: ElementParametrs = {
      tag: "div",
      cssClasses: ["game-field__words-panel", "words-panel"],
    };
    const wordsPanel = new WordsPanelView(WORDS_PANEL_PARAMS, this.appLoader);
    this.getHtmlElement().append(wordsPanel.getHtmlElement());
    return wordsPanel;
  }
}
