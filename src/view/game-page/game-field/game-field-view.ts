import { ViewLoadable } from "../../../util/viewLoadable";
import { ElementParametrs } from "../../../types/view-types";
import { Loader } from "../../../loader/loader";
import { ResultPanelView } from "./result-panel/result-panel-view";
import { WordsPanelView } from "./words-panel/words-panel";
import { AnimationMaker, InsertOptions } from "../../../util/animation-maker";
import "./game-field-style.scss";

export class GameFieldView extends ViewLoadable {
  resultPanelView: ResultPanelView;

  wordsPanelView: WordsPanelView;

  wordsLines: HTMLElement[];

  resultLines: HTMLElement[];

  wordsActiveLine: HTMLElement;

  resultActiveLine: HTMLElement;

  constructor(params: ElementParametrs, appLoader: Loader) {
    super(params, appLoader);
    this.resultPanelView = this.createResultPanel();
    this.wordsPanelView = this.createWordsPanel();
    this.wordsLines = [];
    this.resultLines = [];
    this.fillLinesProperties();
    [this.wordsActiveLine] = this.wordsLines;
    [this.resultActiveLine] = this.resultLines;
    this.itemsPointerEvents();
    this.itemsDragAndDrop();
  }

  private createResultPanel(): ResultPanelView {
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

  private createWordsPanel(): WordsPanelView {
    const WORDS_PANEL_PARAMS: ElementParametrs = {
      tag: "div",
      cssClasses: ["game-field__words-panel", "words-panel"],
    };
    const wordsPanel = new WordsPanelView(WORDS_PANEL_PARAMS, this.appLoader);
    this.getHtmlElement().append(wordsPanel.getHtmlElement());
    return wordsPanel;
  }

  private fillLinesProperties(): void {
    const wordsLines = [
      ...this.wordsPanelView.getHtmlElement().querySelectorAll(".line"),
    ];
    const resultLines = [
      ...this.resultPanelView.getHtmlElement().querySelectorAll(".line"),
    ];
    wordsLines.forEach((line) => {
      if (line instanceof HTMLElement) {
        this.wordsLines.push(line);
      }
    });
    resultLines.forEach((line) => {
      if (line instanceof HTMLElement) {
        this.resultLines.push(line);
      }
    });
  }

  public moveToNextSentence(): void {
    [this.wordsActiveLine, this.resultActiveLine].forEach((line) => {
      const nextLine = line.nextElementSibling;
      if (!(nextLine instanceof HTMLElement)) {
        return;
      }
      if (line.classList.contains("result-panel__line_active")) {
        line.classList.remove("result-panel__line_active");
        nextLine.classList.add("result-panel__line_active");
        this.resultActiveLine = nextLine;
      } else {
        line.classList.remove("words-panel__line_active");
        nextLine.classList.add("words-panel__line_active");
        this.wordsActiveLine = nextLine;
      }
    });
    this.appLoader.sentenceNumber += 1;
  }

  public itemsEventsSetup(event: Event): HTMLElement[] | null {
    const { currentTarget: line, target } = event;
    if (!(target instanceof HTMLElement) || !(line instanceof HTMLElement)) {
      throw new Error("currenTtarget or target is not HTMLelement");
    } else if (line === null || target === null) {
      throw new Error("cannot find target or current target");
    }
    // disable events on inactive lines
    if (
      target === line ||
      (line !== this.resultActiveLine && line !== this.wordsActiveLine)
    ) {
      return null;
    }
    // finding item
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
    // disable events on bleached(hidden) elements
    if (item.style.opacity === "0") {
      return null;
    }
    return [line, item];
  }

  private itemsPointerEvents(): void {
    [...this.wordsLines, ...this.resultLines].forEach((Line) => {
      Line.addEventListener("click", (event: Event) => {
        const arr = this.itemsEventsSetup(event);
        if (arr === null) {
          return;
        }
        const [line, item] = arr;
        const itemAnimator = new AnimationMaker(item);
        const options = {
          smoothDisappearance: true,
        };
        if (line.classList.contains("result-panel__line")) {
          itemAnimator.insert(this.wordsActiveLine, "append", options);
        } else {
          itemAnimator.insert(this.resultActiveLine, "append", options);
        }
      });
    });
  }

  private itemsDragAndDrop(): void {
    [...this.wordsLines, ...this.resultLines].forEach((Line) => {
      Line.addEventListener("pointerdown", (downEvent: PointerEvent) => {
        const { target: pointerDownTarget } = downEvent;
        if (pointerDownTarget instanceof HTMLElement) {
          pointerDownTarget.ondragstart = () => false;
          pointerDownTarget.onmousedown = () => false;
        }
        const arr = this.itemsEventsSetup(downEvent);
        if (arr === null) {
          return;
        }
        const [line, item] = arr;
        if (item.getAttribute("insertAnimation") === "true") {
          return;
        }
        const initCoordinates = item.getBoundingClientRect();
        const itemAnimator = new AnimationMaker(item);
        let pointerMoveHandler: (moveEvent: PointerEvent) => void;
        let followPointerHandler: (moveEvent: PointerEvent) => void;
        let pointerUpIsNeeded = false;
        window.addEventListener(
          "pointermove",
          (pointerMoveHandler = (moveEvent: PointerEvent) => {
            if (
              Math.abs(downEvent.clientX - moveEvent.clientX) > 15 ||
              Math.abs(downEvent.clientY - moveEvent.clientY) > 15
            ) {
              followPointerHandler = itemAnimator.startfollowPointer(
                initCoordinates,
                downEvent,
              );
              pointerUpIsNeeded = true;
              window.removeEventListener("pointermove", pointerMoveHandler);
            }
          }),
        );
        const pointerUpHandler = (upEvent: PointerEvent) => {
          window.removeEventListener("pointermove", pointerMoveHandler);
          if (!pointerUpIsNeeded) {
            return;
          }
          item.style.display = "none";
          const elUnderMouse = document.elementFromPoint(
            upEvent.clientX,
            upEvent.clientY,
          );
          if (!(elUnderMouse instanceof HTMLElement)) {
            return;
          }
          item.style.display = "";
          let insertItem: HTMLElement | null;
          if (
            (elUnderMouse?.classList.contains("item__text") ||
              elUnderMouse?.classList.contains("item__image")) &&
            elUnderMouse.parentElement !== null &&
            elUnderMouse.parentElement.style.opacity !== "0"
          ) {
            insertItem = elUnderMouse.parentElement;
          } else if (elUnderMouse?.classList.contains("item")) {
            insertItem = elUnderMouse;
          } else {
            insertItem = null;
          }
          if (insertItem !== null) {
            const insertItemCoordinates = insertItem?.getBoundingClientRect();
            itemAnimator.stopFollowPointer(followPointerHandler, {
              smoothDisappearance: true,
            });
            let insertOptions: InsertOptions;
            if (
              insertItem.parentElement === line &&
              insertItem.getBoundingClientRect().x > initCoordinates.x
            ) {
              // apend in same line more to the right than item
              insertOptions = {
                smoothDisappearance: true,
                smoothInsert: true,
                sameLaneAfterItem: true,
              };
            } else {
              insertOptions = {
                smoothDisappearance: true,
                smoothInsert: true,
              };
            }
            if (
              upEvent.clientX - insertItemCoordinates.x >=
              insertItemCoordinates.width / 2
            ) {
              itemAnimator.insert(insertItem, "after", insertOptions);
            } else {
              itemAnimator.insert(insertItem, "before", insertOptions);
            }
          } else if (
            elUnderMouse === this.resultActiveLine ||
            elUnderMouse === this.wordsActiveLine
          ) {
            if (elUnderMouse === line) {
              itemAnimator.insert(elUnderMouse, "append", {
                smoothInsert: true,
                sameLaneAfterItem: true,
              });
            } else {
              itemAnimator.insert(elUnderMouse, "append", {
                smoothInsert: true,
              });
            }
            itemAnimator.stopFollowPointer(followPointerHandler, {
              smoothDisappearance: true,
            });
          } else {
            let oppositLine: HTMLElement;
            if (line === this.wordsActiveLine) {
              oppositLine = this.resultActiveLine;
            } else {
              oppositLine = this.wordsActiveLine;
            }
            if (
              Math.abs(
                oppositLine.getBoundingClientRect().y -
                  item.getBoundingClientRect().y,
              ) *
                2 <
              Math.abs(
                line.getBoundingClientRect().y - item.getBoundingClientRect().y,
              )
            ) {
              itemAnimator.insert(oppositLine, "append", {
                smoothDisappearance: true,
              });
              itemAnimator.stopFollowPointer(followPointerHandler, {
                smoothDisappearance: true,
              });
            } else {
              itemAnimator.stopFollowPointer(followPointerHandler, {
                returnIsNeeded: true,
              });
            }
          }
          window.removeEventListener("pointerup", pointerUpHandler);
        };
        window.addEventListener("pointerup", pointerUpHandler);
      });
    });
  }
}
