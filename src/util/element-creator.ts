import { Atributes, ElementParametrs } from "../types/view-types";

export class ElementCreator {
  private element: HTMLElement | null;

  constructor(param: ElementParametrs) {
    this.element = null;
    this.createElement(param.tag);
    this.setCssCLasses(param.cssClasses);
    if (param.textContent !== undefined) {
      this.setTextContent(param.textContent);
    }
    if (param.atributes !== undefined) {
      this.setElementAttributes(param.atributes);
    }
  }

  private createElement(tag: string): void {
    this.element = document.createElement(tag);
  }

  private setCssCLasses(cssClasses: string[]): void {
    for (let i = 0; i < cssClasses.length; i += 1) {
      this.element?.classList.add(cssClasses[i].trim());
    }
  }

  public getElement(): HTMLElement {
    if (this.element === null) {
      throw new Error("element is null");
    }
    return this.element;
  }

  public addInnerElements(...param: HTMLElement[]): void {
    for (let i = 0; i < param.length; i += 1) {
      this.getElement()?.append(param[i]);
    }
  }

  private setTextContent(text: string): void {
    if (this.element !== null) {
      this.element.textContent = text;
    }
  }

  private setElementAttributes(atributes: Atributes[]): void {
    for (let i = 0; i < atributes.length; i += 1) {
      this.element?.setAttribute(atributes[i].name, atributes[i].value);
    }
  }
}
