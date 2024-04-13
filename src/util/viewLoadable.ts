import { View } from "./view";
import { Loader } from "../loader/loader";
import { ElementParametrs } from "../types/view-types";

export class ViewLoadable extends View {
  appLoader: Loader;

  constructor(params: ElementParametrs, appLoader: Loader) {
    super(params);
    this.appLoader = appLoader;
  }
}
