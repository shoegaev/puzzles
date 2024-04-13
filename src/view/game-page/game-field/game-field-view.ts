import { ViewLoadable } from "../../../util/viewLoadable";
import { ElementParametrs } from "../../../types/view-types";
import { Loader } from "../../../loader/loader";
import { ElementCreator } from "../../../util/element-creator";
import "./level-field-style.scss";

export class GameFieldView extends ViewLoadable {
  constructor(params: ElementParametrs, appLoader: Loader) {
    super(params, appLoader);
    this.addInnerElementsParams();
  }

  protected addInnerElementsParams(): void {
    this.innerElementsParams = [
      {

      }
    ]
  }
}
