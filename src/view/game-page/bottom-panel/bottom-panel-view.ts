import { ViewLoadable } from "../../../util/viewLoadable";
import { ElementParametrs } from "../../../types/view-types";
import { Loader } from "../../../loader/loader";
import { GameFieldView } from "../game-field/game-field-view";
import "./bottom-panel-style.scss";

export class BottomPanelView extends ViewLoadable {
  gameFieldView: GameFieldView;

  constructor(
    params: ElementParametrs,
    appLoader: Loader,
    gameFieldView: GameFieldView,
  ) {
    super(params, appLoader);
    this.gameFieldView = gameFieldView;
    this.addInnerElementParams();
    this.addInnerElements();
    this.hideWordsButtonOnCLick();
    this.continueButtonOnCLick();
    this.continueButtonStatus();
  }

  private addInnerElementParams(): void {
    this.innerElementsParams = [
      {
        tag: "div",
        cssClasses: ["button", "bottom-panel__check-button", "button_disabled"],
        textContent: "Check",
      },
      {
        tag: "div",
        cssClasses: [
          "button",
          "bottom-panel__continue-button",
          "button_disabled",
        ],
        textContent: "Continue",
      },
      {
        tag: "div",
        cssClasses: ["button", "bottom-panel__hide-words-button"],
        textContent: "Hide words",
      },
    ];
  }

  private hideWordsButtonOnCLick(): void {
    const button = this.getHtmlElement().querySelector(
      ".bottom-panel__hide-words-button",
    );
    button?.addEventListener("click", () => {
      if (button.textContent?.trim() === "Hide words") {
        button.textContent = "Show words";
      } else {
        button.textContent = "Hide words";
      }
      const items = [
        ...this.gameFieldView.getHtmlElement().querySelectorAll(".item"),
      ];
      items.forEach((item) => {
        if (item.classList.contains("item_no-text")) {
          item.classList.remove("item_no-text");
        } else {
          item.classList.add("item_no-text");
        }
      });
    });
  }

  private continueButtonOnCLick(): void {
    const button = this.getHtmlElement().querySelector(
      ".bottom-panel__continue-button",
    );

    button?.addEventListener("click", () => {
      if (button.classList.contains("button_disabled")) {
        return;
      }
      this.gameFieldView.moveToNextSentence();
    });
  }

  private continueButtonStatus(): void {
    const continueButton = this.getHtmlElement().querySelector(
      ".bottom-panel__continue-button",
    );
    const lines = [
      ...this.gameFieldView.getHtmlElement().querySelectorAll(".line"),
    ];
    lines.forEach((line) => {
      line.addEventListener("pointerdown", (downEvent: Event) => {
        const arr = this.gameFieldView.itemsEventsSetup(downEvent);
        if (arr === null) {
          return;
        }
        const [, item] = arr;
        const pointerUpHandler = () => {
          setTimeout(() => {
            const currentSentence = [
              ...this.gameFieldView.resultActiveLine.children,
            ].reduce((acc, el) => `${acc}${el.textContent?.trim()}`, "");
            if (
              this.appLoader.currentSentences[this.appLoader.sentenceNumber - 1]
                .split(" ")
                .join("") === currentSentence
            ) {
              continueButton?.classList.remove("button_disabled");
            } else {
              continueButton?.classList.add("button_disabled");
            }
            item.removeEventListener("pointerup", pointerUpHandler);
          }, 0);
        };
        item.addEventListener("pointerup", pointerUpHandler);
      });
    });
  }
}
