import { ViewLoadable } from "../../../util/viewLoadable";
import { ElementParametrs } from "../../../types/view-types";
import { Loader } from "../../../loader/loader";
import { ElementCreator } from "../../../util/element-creator";
import { AnimationMaker } from "../../../util/animation-maker";
import { AppCashe } from "../../../app-cashe/app-cashe";
import { GameFieldView } from "../game-field/game-field-view";
import "./level-selector-style.scss";

export class GameSelectorInerfaceView extends ViewLoadable {
  private config: {
    levelNumber: number;
    roundNumber: number;
  };

  private levelSelector: HTMLElement | null;

  private roundSelector: HTMLElement | null;

  private appCashe: AppCashe;

  private gameFieldView: GameFieldView;

  constructor(
    params: ElementParametrs,
    appLoader: Loader,
    appCashe: AppCashe,
    gameFieldView: GameFieldView,
  ) {
    super(params, appLoader);
    this.appCashe = appCashe;
    this.config = {
      levelNumber: appCashe.cashObject.level,
      roundNumber: appCashe.cashObject.round,
    };
    this.gameFieldView = gameFieldView;
    this.levelSelector = null;
    this.roundSelector = null;
    this.configureView();
    this.ItemsOnClick();
    this.buttonOnClick();
    this.closeButtonOnClick();
  }

  private configureView(): void {
    this.addInnerElementsParams();
    this.addInnerElements();
    this.assignSelectors();
    this.addRounds();
  }

  private addInnerElementsParams(): void {
    this.innerElementsParams = [
      {
        tag: "div",
        cssClasses: ["game-selector__close-button", "close-button", "button"],
      },
      {
        tag: "div",
        cssClasses: ["close-button__stick"],
        target: ".game-selector__close-button",
      },
      {
        tag: "div",
        cssClasses: ["close-button__stick"],
        target: ".game-selector__close-button",
      },
      {
        tag: "div",
        cssClasses: ["game-selector__game-information"],
      },
      {
        tag: "div",
        cssClasses: ["game-information__heading"],
        target: ".game-selector__game-information",
        textContent: "Game information",
      },
      {
        tag: "div",
        cssClasses: ["game-information__information"],
        target: ".game-selector__game-information",
      },
      {
        tag: "div",
        cssClasses: ["game-information__level"],
        textContent: `Level: ${this.config.levelNumber}`,
        target: ".game-information__information",
      },
      {
        tag: "div",
        cssClasses: ["game-information__round"],
        textContent: `Round: ${this.config.roundNumber}`,
        target: ".game-information__information",
      },
      {
        tag: "div",
        cssClasses: ["game-selector__selectors"],
      },
      {
        tag: "div",
        cssClasses: ["game-selector__level-selector", "selector"],
        target: ".game-selector__selectors",
      },
      {
        tag: "div",
        cssClasses: ["game-selector__round-selector", "selector"],
        target: ".game-selector__selectors",
      },
      {
        tag: "div",
        cssClasses: ["game-selector__button", "button"],
        textContent: "change level",
      },
    ];
    for (let i = 1; i < 7; i += 1) {
      this.innerElementsParams.push(
        {
          tag: "div",
          cssClasses: ["selector__item"],
          target: ".game-selector__level-selector",
        },
        {
          tag: "span",
          cssClasses: ["selector__item-text"],
          textContent: `Level ${i}`,
          target: ".game-selector__level-selector .selector__item:last-child",
        },
        {
          tag: "div",
          cssClasses: ["selector__item-status"],
          target: ".game-selector__level-selector .selector__item:last-child",
        },
      );
    }
  }

  private assignSelectors(): void {
    const roundSelector = this.getHtmlElement().querySelector(
      ".game-selector__round-selector",
    );
    const levelSelector = this.getHtmlElement().querySelector(
      ".game-selector__level-selector",
    );
    if (
      roundSelector instanceof HTMLElement &&
      levelSelector instanceof HTMLElement
    ) {
      this.roundSelector = roundSelector;
      this.levelSelector = levelSelector;
    }
  }

  private addRounds(): void {
    if (this.roundSelector === null) {
      throw new Error("roundSelector is null");
    }
    this.roundSelector.innerHTML = "";
    this.appLoader.levelData?.then((levelData) => {
      const roundsQuantity = levelData.roundsCount;
      for (let i = 1; i <= roundsQuantity; i += 1) {
        const roundItem = new ElementCreator({
          tag: "div",
          cssClasses: ["selector__item"],
        });
        const itemText = new ElementCreator({
          tag: "span",
          cssClasses: ["selector__item-text"],
          textContent: `Round ${i}`,
        });
        const itemStatus = new ElementCreator({
          tag: "div",
          cssClasses: ["selector__item-status"],
        });
        roundItem
          .getElement()
          .append(itemText.getElement(), itemStatus.getElement());
        this.roundSelector?.append(roundItem.getElement());
      }
    });
  }

  private ItemsOnClick(): void {
    const arr = [this.levelSelector, this.roundSelector];
    arr.forEach((selector) => {
      selector?.addEventListener("click", (event) => {
        const { target, currentTarget } = event;
        if (
          target === this.levelSelector ||
          target === this.roundSelector ||
          !(target instanceof HTMLElement) ||
          !(currentTarget instanceof HTMLElement)
        ) {
          return;
        }
        // find div 'selector__item'
        let item: Element | null;
        if (target.classList.contains("selector__item")) {
          item = target;
        } else if (
          target.classList.contains("selector__item-text") ||
          target.classList.contains("selector__item-status")
        ) {
          item = target.parentElement;
        } else {
          return;
        }

        // check if item already active
        if (item?.classList.contains("selector__item_active")) {
          return;
        }
        // load rounds
        if (currentTarget.classList.contains("game-selector__level-selector")) {
          this.changeLevelrounds(target);
        }

        // change config and selected item class
        this.ItemsClassAndConfigChange(currentTarget, item);

        // change button class
        this.buttonStatus();
      });
    });
  }

  private ItemsClassAndConfigChange(
    container: HTMLElement,
    item: Element | null,
  ): void {
    const text = item?.textContent?.trim();
    if (text === undefined || text === null) {
      throw new Error(`text is ${text}`);
    }
    const textArr = text.split(" ");
    // change config
    if (textArr[0] === "Level") {
      this.config.levelNumber = Number(textArr[1]);
    } else {
      this.config.roundNumber = Number(textArr[1]);
    }
    // change class
    const items = [...container.children];
    items.forEach((el) => {
      el.classList.remove("selector__item_active");
    });
    item?.classList.add("selector__item_active");
  }

  private changeLevelrounds(selectedRoundItem: HTMLElement): void {
    if (!(selectedRoundItem instanceof HTMLElement)) {
      return;
    }
    const levelNumber = selectedRoundItem?.innerText.trim().slice(-1);
    this.appLoader.loadLevelData(levelNumber);
    this.addRounds();
  }

  private buttonStatus(): void {
    const button = this.getHtmlElement().querySelector(
      ".game-selector__button",
    );
    const selectors = [this.levelSelector, this.roundSelector];
    let leveSelected = false;
    let roundSelected = false;
    selectors.forEach((selector) => {
      const children = selector?.children;
      if (children === undefined) {
        return;
      }
      for (let i = 0; i < children.length; i += 1) {
        if (children[i].classList.contains("selector__item_active")) {
          if (selector === this.levelSelector) {
            leveSelected = true;
          } else {
            roundSelected = true;
          }
          break;
        }
      }
    });
    if (leveSelected && roundSelected) {
      button?.classList.remove("button_disabled");
    } else {
      button?.classList.add("button_disabled");
    }
  }

  private fillGameInformation(): void {
    const round = this.getHtmlElement().querySelector(
      ".game-information__round",
    );
    const level = this.getHtmlElement().querySelector(
      ".game-information__level",
    );
    if (round === null || level === null) {
      return;
    }
    level.textContent = `Level: ${this.config.levelNumber}`;
    round.textContent = `Round: ${this.config.roundNumber}`;
  }

  private buttonOnClick(): void {
    const button = this.getHtmlElement().querySelector(
      ".game-selector__button",
    );
    if (button === null) {
      return;
    }
    button.addEventListener("click", () => {
      if (
        button.classList.contains("button_disabled") &&
        this.getHtmlElement().classList.contains("game-selector_open")
      ) {
        return;
      }
      if (this.getHtmlElement().classList.contains("game-selector_open")) {
        this.fillGameInformation();
        this.closeModalWindow();
        this.appLoader.loadFullData(
          String(this.config.levelNumber),
          String(this.config.roundNumber),
        );
        this.gameFieldView.refillPanel();
        this.appCashe.setRoundAndLevelNumbers(
          this.config.roundNumber,
          this.config.levelNumber,
        );
      } else {
        this.openModalWindow();
        this.addRounds();
        this.buttonStatus();
      }
    });
  }

  private closeButtonOnClick(): void {
    const closeButton = this.getHtmlElement().querySelector(
      ".game-selector__close-button",
    );
    closeButton?.addEventListener("click", () => {
      this.closeModalWindow();
    });
  }

  private openModalWindow(): void {
    const button = this.getHtmlElement().querySelector(
      ".game-selector__button",
    );
    if (button === null) {
      return;
    }

    const panel = this.getHtmlElement();
    const panelAnimator = new AnimationMaker(panel);
    panelAnimator.animationDuration = 0.8;
    panelAnimator.centerOnPage({ saveEmptyPlace: true });
    setTimeout(() => {
      panel.classList.add("game-selector_open");
      this.levelSelector?.children[this.config.levelNumber - 1].classList.add(
        "selector__item_active",
      );
      button.textContent = "play";
      document.body.classList.add("modal-window-opened");
    }, 0);
  }

  private closeModalWindow(): void {
    const button = this.getHtmlElement().querySelector(
      ".game-selector__button",
    );
    if (button === null) {
      return;
    }
    const panel = this.getHtmlElement();
    const panelAnimator = new AnimationMaker(panel);
    const copy = document.querySelector(".game-page .game-page__game-selector");
    if (!(copy instanceof HTMLElement)) {
      throw new Error();
    }
    panelAnimator.animationDuration = 0.8;
    panelAnimator.returnAfterCenter(copy);
    panel.classList.remove("game-selector_open");
    button.classList.remove("button_disabled");
    button.textContent = "change level";
    document.body.classList.remove("modal-window-opened");
  }

  public newGame(levelNumber: number, roundNumber: number): void {
    this.config = {
      levelNumber,
      roundNumber,
    };
    this.fillGameInformation();
  }
}
