import { ElementCreator } from "./element-creator";
import { ElementParametrs } from "../types/view-types";

export class View {
  viewCreator: ElementCreator;

  protected innerElementsParams: ElementParametrs[];

  constructor(param: ElementParametrs) {
    this.viewCreator = new ElementCreator(param);
    this.innerElementsParams = [];
  }

  protected addInnerElements(): void {
    this.innerElementsParams?.forEach((params) => {
      let quantity: number;
      if (params.quantity === undefined) {
        quantity = 1;
      } else {
        quantity = params.quantity;
      }
      for (let y = 0; y < quantity; y++) {
        const element = new ElementCreator(params);
        if (params.target === undefined) {
          this.getHtmlElement().append(element.getElement());
        } else {
          this.getHtmlElement()
            .querySelector(params.target)
            ?.append(element.getElement());
        }
      }
    });
  }

  public getHtmlElement(): HTMLElement {
    return this.viewCreator.getElement();
  }

  public removeView(): void {
    this.getHtmlElement().remove();
  }
}
