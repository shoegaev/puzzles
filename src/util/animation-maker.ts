export type InsertMethods = "append" | "after" | "before";
export type InsertOptions = {
  smoothDisappearance?: boolean;
  smoothInsert?: boolean;
  sameLaneAfterItem?: boolean;
};

export class AnimationMaker {
  private element: HTMLElement;

  private initialComputedTransition: string;

  private initialInlineTransition: string;

  private folowPointerStatus: {
    isActive: boolean;
    copy: null | HTMLElement;
    initWidth: string | null;
    initHeight: string | null;
  };

  animationDuration: number;

  constructor(element: HTMLElement) {
    this.element = element;
    this.initialComputedTransition =
      window.getComputedStyle(element).transition;
    this.initialInlineTransition = element.style.transition;
    this.folowPointerStatus = {
      isActive: false,
      copy: null,
      initWidth: null,
      initHeight: null,
    };
    this.animationDuration = 0.4;
  }

  private setTransition(transition: string) {
    if (this.initialComputedTransition === "") {
      this.element.style.transition = transition;
    } else {
      this.element.style.transition = `${this.initialComputedTransition}, ${transition}`;
    }
  }

  private resetTransition() {
    this.element.style.transition = this.initialInlineTransition;
  }

  public bleach(): void {
    const transition = `opacity ${this.animationDuration}s ease`;
    this.setTransition(transition);
    this.element.style.opacity = "0";
  }

  public squeezeAndDelete(): void {
    const transition = `width ${this.animationDuration}s ease`;
    this.setTransition(transition);
    this.element.style.overflow = "hidden";
    this.element.style.width = `${window.getComputedStyle(this.element).width}`;
    this.element.style.width = "0px";
    setTimeout(() => {
      this.element.remove();
    }, this.animationDuration * 1000);
  }

  public insert(
    insertElement: HTMLElement,
    insertMethod: InsertMethods,
    options?: InsertOptions,
  ): void {
    // set atribute and save initial coordinates, width and height value
    this.element.setAttribute("insertAnimation", "true");
    const initialCoordinates = this.element.getBoundingClientRect();
    const initWidth = this.element.style.width;
    const initHeight = this.element.style.height;
    // if needed create elements bleached copy in initial place, and squeeze it.
    if (options?.smoothDisappearance) {
      // copy is empty for to correct verification of sentence.
      const copy = this.element.cloneNode();
      if (!(copy instanceof HTMLElement)) {
        throw new Error("copy is not HTMLElement");
      }
      copy.style.width = `${initialCoordinates.width}px`;
      copy.style.height = `${initialCoordinates.height}px`;
      const copyAnimator = new AnimationMaker(copy);
      this.element.before(copy);
      copyAnimator.bleach();
      copyAnimator.squeezeAndDelete();
    }
    // create a copy to insert in the desired place:
    const insertCopy = this.element.cloneNode(true);
    if (!(insertCopy instanceof HTMLElement)) {
      throw new Error("copy is not HTMLElement");
    }

    insertCopy.style.position = "";
    insertCopy.style.left = "";
    insertCopy.style.top = "";

    const copyAnimator = new AnimationMaker(insertCopy);
    // --- make copy transparent
    copyAnimator.animationDuration = 0;
    copyAnimator.bleach();
    copyAnimator.animationDuration = 0.4;
    // --- if needed set initial 0 width value and transition value
    if (options?.smoothInsert) {
      insertCopy.style.width = "0px";
      const copyTransition = `width ${this.animationDuration}s ease`;
      copyAnimator.setTransition(copyTransition);
    }
    // --- insert and save coordinates
    insertElement[insertMethod](insertCopy);
    const insertCopyCoordinates = insertCopy.getBoundingClientRect();

    // move element to body so that its size and location dont change:
    this.element.style.position = "absolute";
    this.element.style.width = `${initialCoordinates.width}px`;
    this.element.style.height = `${initialCoordinates.height}px`;
    this.element.style.top = `${initialCoordinates.y + window.scrollY}px`;
    this.element.style.left = `${initialCoordinates.x + window.scrollX}px`;
    this.element.style.zIndex = "1000";
    document.body.append(this.element);
    const transition = `top ${this.animationDuration / 1.5}s ease, left ${
      this.animationDuration
    }s ease`;
    this.setTransition(transition);

    setTimeout(() => {
      // set insert copies width (if option.smoothInsert === true - copy smoothly push neighbors)
      if (options?.smoothInsert) {
        insertCopy.style.width = `${initialCoordinates.width}px`;
      }
      // change element top, left so that it move
      if (options?.sameLaneAfterItem) {
        // if element is inserted in the same line to the right of its original position
        this.element.style.left = `${
          insertCopyCoordinates.x + window.scrollX - initialCoordinates.width
        }px`;
      } else {
        this.element.style.left = `${
          insertCopyCoordinates.x + window.scrollX
        }px`;
      }
      this.element.style.top = `${insertCopyCoordinates.y + window.scrollY}px`;

      setTimeout(() => {
        // insert element in final place, clear inline properties value, set initial width,height values
        insertCopy.after(this.element);
        insertCopy.remove();
        if (this.folowPointerStatus.initHeight !== null) {
          this.setInitialSize();
        } else {
          this.element.style.width = `${initWidth}`;
          this.element.style.height = `${initHeight}`;
        }
        this.element.style.position = "";
        this.element.style.top = "";
        this.element.style.left = "";
        this.element.style.zIndex = "";
        this.element.removeAttribute("insertAnimation");
        this.resetTransition();
      }, this.animationDuration * 1000);
    }, 0);
  }

  public startfollowPointer(
    initCoordinates: DOMRect,
    downEvent: PointerEvent,
  ): (moveEvent: PointerEvent) => void {
    const eventHandler = (moveEvent: PointerEvent) => {
      if (!this.folowPointerStatus.isActive) {
        this.folowPointerStatus.isActive = true;
        const copy = this.element.cloneNode();
        if (!(copy instanceof HTMLElement)) {
          throw new Error();
        }
        copy.style.width = `${initCoordinates.width}px`;
        copy.style.height = `${initCoordinates.height}px`;
        this.folowPointerStatus.copy = copy;
        const copyAnimator = new AnimationMaker(copy);
        copyAnimator.bleach();

        this.element.before(copy);
        this.element.style.position = "absolute";
        this.element.style.zIndex = "1000";
        document.body.append(this.element);
        document.body.style.overflowX = "hidden";

        this.folowPointerStatus.initHeight = this.element.style.height;
        this.folowPointerStatus.initWidth = this.element.style.width;
        this.element.style.width = `${initCoordinates.width}px`;

        this.element.style.opacity = "0.8";
        this.element.style.scale = "0.9";
      }

      this.element.style.top = `${
        moveEvent.pageY - (downEvent.clientY - initCoordinates.y)
      }px`;
      this.element.style.left = `${
        moveEvent.pageX - (downEvent.clientX - initCoordinates.x)
      }px`;
    };
    window.addEventListener("pointermove", eventHandler);
    return eventHandler;
  }

  public stopFollowPointer(
    followPointerEventHandler: (moveEvent: PointerEvent) => void,
    options?: {
      returnIsNeeded?: boolean;
      smoothDisappearance?: boolean;
    },
  ): void {
    window.removeEventListener("pointermove", followPointerEventHandler);
    document.body.style.overflow = "";

    this.element.style.zIndex = "";
    this.element.style.opacity = "";
    this.element.style.scale = "";
    const { copy } = this.folowPointerStatus;
    if (copy === null) {
      return;
    }
    const copyAnimator = new AnimationMaker(copy);
    let returnInsertParams: [HTMLElement, InsertMethods];
    if (copy.previousElementSibling instanceof HTMLElement) {
      returnInsertParams = [copy.previousElementSibling, "after"];
    } else if (copy.nextElementSibling instanceof HTMLElement) {
      returnInsertParams = [copy.nextElementSibling, "before"];
    } else if (copy.parentElement instanceof HTMLElement) {
      returnInsertParams = [copy.parentElement, "append"];
    } else {
      throw new Error();
    }
    if (options?.smoothDisappearance) {
      copyAnimator.squeezeAndDelete();
    } else {
      copy.remove();
    }
    if (options?.returnIsNeeded) {
      this.insert(...returnInsertParams);
    }

    this.folowPointerStatus.copy = null;
    this.folowPointerStatus.isActive = false;
  }

  private setInitialSize(): void {
    if (
      this.folowPointerStatus.initHeight !== null &&
      this.folowPointerStatus.initWidth !== null
    ) {
      this.element.style.height = this.folowPointerStatus.initHeight;
      this.element.style.width = this.folowPointerStatus.initWidth;
      this.folowPointerStatus.initHeight = null;
      this.folowPointerStatus.initWidth = null;
    }
  }

  public centerOnPage(options: { saveEmptyPlace: boolean }): HTMLElement {
    const initialCoordinates = this.element.getBoundingClientRect();
    const copy = this.element.cloneNode(true);
    if (!(copy instanceof HTMLElement)) {
      throw new Error();
    }
    if (options.saveEmptyPlace) {
      const copyAnimator = new AnimationMaker(copy);
      copyAnimator.animationDuration = 0;
      copyAnimator.bleach();
      this.element.after(copy);
    }

    this.element.style.position = "absolute";
    this.element.style.top = `${initialCoordinates.y + window.scrollY}px`;
    this.element.style.left = `${initialCoordinates.x + window.scrollX}px`;
    const transition = `top ${this.animationDuration / 1.5}s ease, left ${
      this.animationDuration
    }s ease`;
    this.setTransition(transition);
    document.body.append(this.element);
    setTimeout(() => {
      this.element.style.zIndex = "1000";
      this.element.style.top = `calc(50vh + ${window.scrollY}px)`;
      this.element.style.left = `calc(50vw + ${window.scrollX}px)`;
      this.element.style.transform = "translate(-50%, -50%)";
      setTimeout(() => {
        this.resetTransition();
      }, this.animationDuration * 1000);
    }, 0);
    return copy;
  }

  public returnAfterCenter(copy: HTMLElement): void {
    const copyCoordinates = copy.getBoundingClientRect();
    const transition = `top ${this.animationDuration / 1.5}s ease, left ${
      this.animationDuration
    }s ease`;
    this.setTransition(transition);
    this.element.style.top = `${copyCoordinates.y + window.scrollY}px`;
    this.element.style.left = `${copyCoordinates.x + window.scrollX}px`;
    this.element.style.transform = "";

    setTimeout(() => {
      this.resetTransition();
      this.element.style.zIndex = "";
      this.element.style.position = "";
      copy.after(this.element);
      copy.remove();
      this.element.style.top = "";
      this.element.style.left = "";
    }, this.animationDuration * 1000);
  }
}
