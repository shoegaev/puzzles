import { ViewLoadable } from "../../../util/viewLoadable";
import { ElementParametrs } from "../../../types/view-types";
import { Loader } from "../../../loader/loader";
import { ResultPanelView } from "./result-panel/result-panel-view";
import { WordsPanelView } from "./words-panel/words-panel";
import { AnimationMaker, InsertOptions } from "../../../util/animation-maker";
import { AppCashe } from "../../../app-cashe/app-cashe";
import "./game-field-style.scss";

export class GameFieldView extends ViewLoadable {
  appCashe: AppCashe;

  resultPanelView: ResultPanelView;

  wordsPanelView: WordsPanelView;

  wordsLines: HTMLElement[];

  resultLines: HTMLElement[];

  wordsActiveLine: HTMLElement;

  resultActiveLine: HTMLElement;

  constructor(params: ElementParametrs, appLoader: Loader, appCashe: AppCashe) {
    super(params, appLoader);
    this.appCashe = appCashe;
    this.resultPanelView = this.createResultPanel();
    this.wordsPanelView = this.createWordsPanel();
    this.wordsLines = [];
    this.resultLines = [];
    this.fillLinesProperties();
    [this.wordsActiveLine] = this.wordsLines;
    [this.resultActiveLine] = this.resultLines;
    this.itemsPointerEvents();
    this.itemsDragAndDrop();
    this.loadPreviousGameState();
  }

  private loadPreviousGameState(): void {
    this.appLoader.fullData?.then(() => {
      const { filledSentenceNumber } = this.appCashe.cashObject;
      for (let i = 0; i < filledSentenceNumber; i += 1) {
        this.fillSentence(
          this.appLoader.currentSentences[i].split(" "),
          this.wordsLines[i],
          this.resultLines[i],
        );
      }
      if (filledSentenceNumber !== 0) {
        this.wordsActiveLine.classList.remove("words-panel__line_active");
        this.resultActiveLine.classList.remove("result-panel__line_active");
        this.wordsActiveLine = this.wordsLines[filledSentenceNumber];
        this.resultActiveLine = this.resultLines[filledSentenceNumber];
        this.wordsActiveLine.classList.add("words-panel__line_active");
        this.resultActiveLine.classList.add("result-panel__line_active");
      }
      this.fillSentence(
        this.appCashe.cashObject.wordsInResultLine.currentState,
        this.wordsActiveLine,
        this.resultActiveLine,
      );
    });
  }

  public fillSentence = (
    sentence: string[],
    wordLine: HTMLElement,
    resultLine: HTMLElement,
  ): void => {
    const items = [...wordLine.children];
    sentence.forEach((word) => {
      const neededItem = items.find(
        (item) => item.textContent?.trim() === word,
      );
      if (neededItem === undefined) {
        throw new Error();
      }
      items.splice(items.indexOf(neededItem), 1);
      resultLine.append(neededItem);
    });
  };

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
    this.appCashe.nextSentence();
  }

  public itemsEventsSetup(event: Event): {
    line: HTMLElement;
    item: HTMLElement;
    index: number;
    word: string;
  } | null {
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
    // find item word, item index in line
    let previousSibling = item.previousElementSibling;
    let index = 0;
    while (previousSibling) {
      index += 1;
      previousSibling = previousSibling.previousElementSibling;
    }
    const word = item.textContent?.trim();
    if (word === undefined) {
      throw new Error("Cannot read word frow item");
    }
    return {
      line,
      item,
      index,
      word,
    };
  }

  private itemsPointerEvents(): void {
    [...this.wordsLines, ...this.resultLines].forEach((Line) => {
      Line.addEventListener("click", (event: Event) => {
        const obj = this.itemsEventsSetup(event);
        if (obj === null) {
          return;
        }
        // eslint-disable-next-line
        const { line, item, index, word } = obj;
        const itemAnimator = new AnimationMaker(item);
        const options = {
          smoothDisappearance: true,
        };
        if (line.classList.contains("result-panel__line")) {
          itemAnimator.insert(this.wordsActiveLine, "append", options);
          this.appCashe.deleteWord(index);
        } else {
          itemAnimator.insert(this.resultActiveLine, "append", options);
          this.appCashe.addWord(
            word,
            this.appCashe.cashObject.wordsInResultLine.currentState.length,
          );
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
        // eslint-disable-next-line
        const { line, item, index, word } = arr;
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
              if (line === this.resultActiveLine) {
                this.appCashe.deleteWord(index);
              }
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
            // ---pointerup under item--------------------------
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
            const insertItemIndex = [
              ...(insertItem.parentElement?.children || []),
            ].indexOf(insertItem);
            if (insertItemIndex === -1) {
              throw new Error("incorrect insertItemIndex");
            }
            if (
              upEvent.clientX - insertItemCoordinates.x >=
              insertItemCoordinates.width / 2
            ) {
              itemAnimator.insert(insertItem, "after", insertOptions);
              if (insertItem.parentElement === this.resultActiveLine) {
                if (insertItem.style.opacity === "0") {
                  this.appCashe.addWord(word, insertItemIndex);
                } else if (
                  index <= insertItemIndex &&
                  line === this.resultActiveLine
                ) {
                  this.appCashe.addWord(word, insertItemIndex);
                } else {
                  this.appCashe.addWord(word, insertItemIndex + 1);
                }
              }
            } else {
              itemAnimator.insert(insertItem, "before", insertOptions);
              if (insertItem.parentElement === this.resultActiveLine) {
                if (index < insertItemIndex && line === this.resultActiveLine) {
                  this.appCashe.addWord(word, insertItemIndex - 1);
                } else {
                  this.appCashe.addWord(word, insertItemIndex);
                }
              }
            }
          } else if (
            elUnderMouse === this.resultActiveLine ||
            elUnderMouse === this.wordsActiveLine
          ) {
            // --- pointerup under active line (words- or result-)-------
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
            if (elUnderMouse === this.resultActiveLine) {
              this.appCashe.addWord(word);
            }
          } else {
            // --- pointer up in random place---------------------------
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
              if (oppositLine === this.resultActiveLine) {
                this.appCashe.addWord(word);
              }
            } else {
              itemAnimator.stopFollowPointer(followPointerHandler, {
                returnIsNeeded: true,
              });
              if (line === this.resultActiveLine) {
                this.appCashe.addWord(word, index);
              }
            }
          }
          window.removeEventListener("pointerup", pointerUpHandler);
        };
        window.addEventListener("pointerup", pointerUpHandler);
      });
    });
  }

  public refillPanel(): void {
    [...this.getHtmlElement().querySelectorAll(".item")].forEach((item) => {
      item.remove();
    });
    this.wordsPanelView.fillPanel();
    this.wordsActiveLine.classList.remove("words-panel__line_active");
    this.resultActiveLine.classList.remove("result-panel__line_active");
    [this.wordsActiveLine] = this.wordsLines;
    [this.resultActiveLine] = this.resultLines;
    this.wordsActiveLine.classList.add("words-panel__line_active");
    this.resultActiveLine.classList.add("result-panel__line_active");
  }

  public setWordsBackgroundOpacity(opacityValue: number): void {
    this.appLoader.fullData?.then(() => {
      if (opacityValue < 0 || opacityValue > 1) {
        throw new Error("incorrect opacity value");
      }
      const itemsSpansElement = [
        ...this.getHtmlElement().querySelectorAll(".item__text"),
      ];

      itemsSpansElement.forEach((element) => {
        if (element instanceof HTMLElement) {
          const elStyles = window.getComputedStyle(element);
          element.style.backgroundColor = `${elStyles.backgroundColor
            .split(",")
            .splice(0, 3)
            .join(",")}, ${opacityValue}`;
        }
      });
    });
  }
}
