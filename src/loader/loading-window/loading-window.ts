import { View } from "../../util/view";
import { ElementParametrs } from "../../types/view-types";
import "./loading-window-style.scss";

export class LoadingWindowView extends View {
  controller: [AbortController | null];

  text: HTMLElement;

  loadingBar: HTMLElement;

  button: HTMLElement;

  constructor(controller: [AbortController | null]) {
    const LOADING_WINDOW_PARAMS: ElementParametrs = {
      tag: "div",
      cssClasses: ["loading-window"],
    };
    super(LOADING_WINDOW_PARAMS);
    this.controller = controller;
    this.addInnerElementsParams();
    this.addInnerElements();
    [this.text, this.loadingBar, this.button] = this.assignProperties();
    this.buttonOnClick();
  }

  private addInnerElementsParams(): void {
    this.innerElementsParams = [
      {
        tag: "span",
        cssClasses: ["loading-window__text"],
        textContent: "Loading...",
      },
      {
        tag: "div",
        cssClasses: [
          "loading-window__loading-bar",
          "loading-window__loading-bar_active",
        ],
      },
      {
        tag: "div",
        cssClasses: ["loading-window__cancel-button", "button"],
        textContent: "Cancel",
      },
    ];
    for (let i = 0; i < 4; i += 1) {
      this.innerElementsParams.push({
        tag: "div",
        cssClasses: ["loading-bar__item"],
        target: ".loading-window__loading-bar",
      });
    }
  }

  private assignProperties(): HTMLElement[] {
    const button = this.getHtmlElement().querySelector(".button");
    const text = this.getHtmlElement().querySelector(".loading-window__text");
    const bar = this.getHtmlElement().querySelector(
      ".loading-window__loading-bar",
    );
    if (
      !(button instanceof HTMLElement) ||
      !(text instanceof HTMLElement) ||
      !(bar instanceof HTMLElement)
    ) {
      throw new Error();
    }
    return [text, bar, button];
  }

  public show(): void {
    this.removeErrorMessage();
    document.body.classList.add("loading-window-opened");
    document.body.prepend(this.getHtmlElement());
    this.getHtmlElement().style.top = `calc(1vh + ${window.scrollY}px)`;
  }

  public remove(): void {
    document.body.classList.remove("loading-window-opened");
    this.getHtmlElement().remove();
  }

  private buttonOnClick(): void {
    this.button.addEventListener("click", () => {
      this.controller[0]?.abort();
      this.remove();
    });
  }

  public setErrorMessage(message: string): void {
    this.text.textContent = message;
    this.loadingBar.classList.remove("loading-window__loading-bar_active");
  }

  public removeErrorMessage(): void {
    this.text.textContent = "Loading...";
    this.loadingBar.classList.add("loading-window__loading-bar_active");
  }
}
