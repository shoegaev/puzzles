import { ViewLoadable } from "../../../util/viewLoadable";
import { ElementParametrs } from "../../../types/view-types";
import { Loader } from "../../../loader/loader";
import { GameFieldView } from "../game-field/game-field-view";
import { AppCashe } from "../../../app-cashe/app-cashe";
import { OpacityControllerView } from "./opacity-controller/opacity-controller-view";
import { GameSelectorInerfaceView } from "../game-selector-inerface/game-selector-interface-view";
import "./bottom-panel-style.scss";

export class BottomPanelView extends ViewLoadable {
  gameFieldView: GameFieldView;

  gameSelectorInerface: GameSelectorInerfaceView;

  appCashe: AppCashe;

  opacityControllerView: OpacityControllerView;

  constructor(
    params: ElementParametrs,
    appLoader: Loader,
    gameFieldView: GameFieldView,
    gameSelectorInerfaceView: GameSelectorInerfaceView,
    appCashe: AppCashe,
  ) {
    super(params, appLoader);
    this.appCashe = appCashe;
    this.gameFieldView = gameFieldView;
    this.gameSelectorInerface = gameSelectorInerfaceView;
    this.addInnerElementParams();
    this.addInnerElements();
    this.opacityControllerView = this.createOpacityControllerView();
    this.continueButtonOnCLick();
    this.continueButtonStatus();
    this.hideWordsButtonOnCLick();
    this.appLoader.fullData?.then(() => {
      this.checkContinueButtonStatus();
    });
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

  private createOpacityControllerView(): OpacityControllerView {
    const params: ElementParametrs = {
      tag: "div",
      cssClasses: ["bottom-panel__opacity-controller", "opacity-controller"],
    };
    const opacityControllerView = new OpacityControllerView(
      params,
      this.gameFieldView,
      this.appCashe,
    );
    this.getHtmlElement().append(opacityControllerView.getHtmlElement());
    return opacityControllerView;
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
      if (this.appCashe.cashObject.filledSentenceNumber === 9) {
        this.appLoader.levelData?.then((data) => {
          const { roundsCount } = data;
          const roundNumber = this.appCashe.cashObject.round;
          const levelNumber = this.appCashe.cashObject.level;
          let nextRoundNumber: number;
          let nextLevelNumber: number;
          if (roundsCount === roundNumber) {
            nextRoundNumber = 1;
            nextLevelNumber = levelNumber + 1;
          } else {
            nextRoundNumber = roundNumber + 1;
            nextLevelNumber = levelNumber;
          }
          this.appLoader.loadFullData(
            String(nextLevelNumber),
            String(nextRoundNumber),
          );
          this.gameFieldView.refillPanel();
          this.appCashe.setRoundAndLevelNumbers(
            nextRoundNumber,
            nextLevelNumber,
          );
          this.gameSelectorInerface.newGame(nextLevelNumber, nextRoundNumber);
        });
      } else {
        this.gameFieldView.moveToNextSentence();
      }
    });
  }

  public checkContinueButtonStatus(): void {
    const assembledSentence =
      this.appCashe.cashObject.wordsInResultLine.currentState;
    const rightSentence = this.appLoader.getCurrentSentence();
    const button = this.getHtmlElement().querySelector(
      ".bottom-panel__continue-button",
    );
    button?.classList.remove("button_disabled");
    for (let i = 0; i < rightSentence.length; i += 1) {
      if (rightSentence[i] !== assembledSentence[i]) {
        button?.classList.add("button_disabled");
        return;
      }
    }
  }

  private continueButtonStatus(): void {
    const lines = [
      ...this.gameFieldView.getHtmlElement().querySelectorAll(".line"),
    ];
    lines.forEach((line) => {
      line.addEventListener("pointerdown", (downEvent: Event) => {
        const arr = this.gameFieldView.itemsEventsSetup(downEvent);
        if (arr === null) {
          return;
        }
        const pointerUpHandler = () => {
          this.checkContinueButtonStatus();
          window.removeEventListener("pointerup", pointerUpHandler);
        };
        window.addEventListener("pointerup", pointerUpHandler);
      });
      line.addEventListener("click", (event) => {
        const arr = this.gameFieldView.itemsEventsSetup(event);
        if (arr === null) {
          return;
        }
        this.checkContinueButtonStatus();
      });
    });
  }
}
