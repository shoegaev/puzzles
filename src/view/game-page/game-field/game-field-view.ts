import { ViewLoadable } from "../../../util/viewLoadable";
import { ElementParametrs } from "../../../types/view-types";
import { Loader } from "../../../loader/loader";
import { ResultPanelView } from "./result-panel/result-panel-view";
import { WordsPanelView } from "./words-panel/words-panel";
import { AnimationMaker, InsertMethods } from "../../../util/animation-maker";
import "./game-field-style.scss";

export class GameFieldView extends ViewLoadable {
  resultPanelView: ResultPanelView;

  wordsPanelView: WordsPanelView;

  panelViews: [ResultPanelView | null, WordsPanelView | null];

  constructor(params: ElementParametrs, appLoader: Loader) {
    super(params, appLoader);
    this.panelViews = [null, null];
    this.resultPanelView = this.createResultPanel();
    this.wordsPanelView = this.createWordsPanel();
    this.itemsOnClick();
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
    this.panelViews[0] = resultPanel;
    return resultPanel;
  }

  createWordsPanel(): WordsPanelView {
    const WORDS_PANEL_PARAMS: ElementParametrs = {
      tag: "div",
      cssClasses: ["game-field__words-panel", "words-panel"],
    };
    const wordsPanel = new WordsPanelView(WORDS_PANEL_PARAMS, this.appLoader);
    this.getHtmlElement().append(wordsPanel.getHtmlElement());
    this.panelViews[1] = wordsPanel;
    return wordsPanel;
  }

  itemsOnClick(): void {
    const wordsLines = [
      ...this.wordsPanelView.getHtmlElement().querySelectorAll(".line"),
    ];
    const resultLines = [
      ...this.resultPanelView.getHtmlElement().querySelectorAll(".line"),
    ];
    function eventHandler(event: Event) {
      const { currentTarget: line, target } = event;

      if (!(target instanceof HTMLElement) || !(line instanceof HTMLElement)) {
        throw new Error("currenTtarget or target is not HTMLelement");
      } else if (line === null || target === null) {
        throw new Error("cannot find target or current target");
      }

      if (target === line) {
        return;
      }

      target.ondragstart = () => false;

      let item: HTMLElement;
      if (
        (target.classList.contains("item__text") ||
          target.classList.contains("item__image")) &&
        target.parentElement !== null
      ) {
        item = target.parentElement;
      } else {
        item = target;
      }
      if (item.style.opacity === "0") {
        return;
      }
      const itemAnimator = new AnimationMaker(item);
      if (line.classList.contains("result-panel__line")) {
        wordsLines.forEach((wordsLine) => {
          if (
            wordsLine.classList.contains("words-panel__line_active") &&
            wordsLine instanceof HTMLElement
          ) {
            itemAnimator.insert(wordsLine, "append");
          }
        });
      } else {
        resultLines.forEach((resultLine) => {
          if (
            resultLine.classList.contains("result-panel__line_active") &&
            resultLine instanceof HTMLElement
          ) {
            itemAnimator.insert(resultLine, "append");
          }
        });
      }
    }
    wordsLines.forEach((wordsLine) => {
      wordsLine.addEventListener("click", eventHandler);
    });
    resultLines.forEach((resultLine) => {
      resultLine.addEventListener("click", eventHandler);
    });
  }
}
