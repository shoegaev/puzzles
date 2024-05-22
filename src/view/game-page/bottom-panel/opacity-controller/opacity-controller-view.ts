import { View } from "../../../../util/view";
import { AppCashe } from "../../../../app-cashe/app-cashe";
import { ElementParametrs } from "../../../../types/view-types";
import { GameFieldView } from "../../game-field/game-field-view";

export class OpacityControllerView extends View {
  gameFieldView: GameFieldView;

  appCashe: AppCashe;

  switch: HTMLElement;

  filler: HTMLElement;

  constructor(
    params: ElementParametrs,
    gameFieldView: GameFieldView,
    appCashe: AppCashe,
  ) {
    super(params);
    this.gameFieldView = gameFieldView;
    this.appCashe = appCashe;
    this.addInnerElementParams();
    this.addInnerElements();
    [this.switch, this.filler] = this.assignProperties();
    this.pointerMoveEvent();
    this.clickEvent();
    this.MoveSwitchAndChangeOpacity(appCashe.cashObject.wordsOpacity);
  }

  private addInnerElementParams(): void {
    this.innerElementsParams = [
      {
        tag: "div",
        cssClasses: ["opacity-controller__toggle-switch"],
      },
      {
        tag: "div",
        cssClasses: ["opacity-controller__filler"],
      },
    ];
  }

  private assignProperties(): HTMLElement[] {
    const controller = this.getHtmlElement();
    const toggleSwitch = this.getHtmlElement().querySelector(
      ".opacity-controller__toggle-switch",
    );
    const filler = this.getHtmlElement().querySelector(
      ".opacity-controller__filler",
    );
    if (
      controller instanceof HTMLElement &&
      toggleSwitch instanceof HTMLElement &&
      filler instanceof HTMLElement
    ) {
      return [toggleSwitch, filler];
    }
    throw new Error("cannot find opacity controller elements");
  }

  private pointerMoveEvent(): void {
    const pointerMoveHandler = (moveevent: PointerEvent) => {
      const controllerCoordinates =
        this.getHtmlElement().getBoundingClientRect();
      if (controllerCoordinates === undefined) {
        return;
      }
      const leftIndent =
        moveevent.pageX - controllerCoordinates.x + window.scrollX;
      this.MoveSwitchAndChangeOpacity(leftIndent / controllerCoordinates.width);
    };
    const pointerUpHandler = () => {
      window.removeEventListener("pointermove", pointerMoveHandler);
      window.removeEventListener("pointerup", pointerUpHandler);
    };
    this.switch.ondragstart = () => false;
    this.getHtmlElement().ondragstart = () => false;
    this.getHtmlElement().addEventListener("pointerdown", () => {
      window.addEventListener("pointermove", pointerMoveHandler);
      window.addEventListener("pointerup", pointerUpHandler);
    });
  }

  private clickEvent(): void {
    this.getHtmlElement().addEventListener("click", (event) => {
      const controllerCoordinates =
        this.getHtmlElement().getBoundingClientRect();
      const leftIndent = event.pageX - controllerCoordinates.x + window.scrollX;
      this.MoveSwitchAndChangeOpacity(leftIndent / controllerCoordinates.width);
    });
  }

  private MoveSwitchAndChangeOpacity(leftIndentShare: number) {
    let indent: number;
    if (leftIndentShare < 0) {
      indent = 0.01;
    } else if (leftIndentShare > 1) {
      indent = 0.99;
    } else {
      indent = leftIndentShare;
    }
    this.switch.style.left = `${indent * 100}%`;
    this.filler.style.width = `${indent * 100}%`;
    this.appCashe.setOpacity(indent);
    this.gameFieldView.setWordsBackgroundOpacity(indent);
  }
}
