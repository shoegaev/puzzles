import { ViewLoadable } from "../../../../util/viewLoadable";
import { ElementParametrs } from "../../../../types/view-types";
import { Loader } from "../../../../loader/loader";

export class ResultPanelView extends ViewLoadable {
  constructor(params: ElementParametrs, appLoader: Loader) {
    super(params, appLoader);
    this.addInnerElementsParams();
    this.addInnerElements();
  }

  protected addInnerElementsParams(): void {
    for (let i = 0; i < 10; i += 1) {
      this.innerElementsParams.push({
        tag: "div",
        cssClasses: ["result-panel__line", "line"],
      });
    }
    this.innerElementsParams[0].cssClasses.push("result-panel__line_active");
  }
}
