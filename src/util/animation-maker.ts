export type InsertMethods = "append" | "after" | "before";

export class AnimationMaker {
  private element: HTMLElement;

  private initialTransition: string;

  animationDuration: number;

  constructor(element: HTMLElement) {
    this.element = element;
    this.initialTransition = element.style.transition;
    this.animationDuration = 0.4;
  }

  private setTransition(transition: string) {
    if (this.initialTransition === "") {
      this.element.style.transition = transition;
    } else {
      this.element.style.transition = `${this.initialTransition}, ${transition}`;
    }
  }

  private resetTransition() {
    this.element.style.transition = this.initialTransition;
  }

  public bleach(): void {
    const transition = `opacity ${this.animationDuration}s ease`;
    this.setTransition(transition);
    this.element.style.opacity = "0";
  }

  private squeezeAndDelete(element: HTMLElement): void {
    const transition = `width ${this.animationDuration}s ease`;
    this.setTransition(transition);
    element.style.width = "0";
    setTimeout(() => {
      element.remove();
    }, this.animationDuration * 1000);
  }

  public remove(): void {
    this.squeezeAndDelete(this.element);
  }

  public insert(insertElement: HTMLElement, insertMethod: InsertMethods): void {
    const initialCoordinates = this.element.getBoundingClientRect();
    const copy = this.element.cloneNode(true);
    this.bleach();
    this.squeezeAndDelete(this.element);
    if (!(copy instanceof HTMLElement)) {
      return;
    }
    this.element = copy;
    insertElement[`${insertMethod}`](copy);
    const finalCoordinates = copy.getBoundingClientRect();
    copy.style.position = "relative";
    copy.style.left = `${initialCoordinates.x - finalCoordinates.x}px`;
    copy.style.top = `${initialCoordinates.y - finalCoordinates.y}px`;
    const transition = `top ${this.animationDuration / 1.5}s ease, left ${
      this.animationDuration
    }s ease`;
    this.setTransition(transition);
    setTimeout(() => {
      copy.style.top = "0px";
      copy.style.left = "0px";
      setTimeout(() => {
        this.resetTransition();
        copy.style.position = "";
        copy.style.left = "";
        copy.style.top = "";
      }, this.animationDuration * 1000);
    }, 0);
  }
}
