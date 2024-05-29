import { LocalStorageData } from "../types/local-storage-data-types";

export class AppCashe {
  public cashObject: LocalStorageData;

  constructor() {
    this.cashObject = {
      level: 1,
      round: 1,
      filledSentenceNumber: 0,
      wordsOpacity: 0.3,
      wordsInResultLine: {
        currentState: [],
        previousState: [],
      },
    };
    this.appStart();
  }

  private appStart() {
    const localStorageItem = localStorage.getItem("puzzleGameData");
    if (localStorageItem !== null) {
      const data: LocalStorageData = JSON.parse(localStorageItem);
      this.cashObject = data;
    }
  }

  public setRoundAndLevelNumbers(
    roundNumber: number,
    levelNumber?: number,
  ): void {
    if (levelNumber !== undefined) {
      this.cashObject.level = levelNumber;
    }
    this.cashObject.round = roundNumber;
    this.cashObject.filledSentenceNumber = 0;
    this.cleanWordsInresultLine();
    this.saveCashe();
  }

  public addWord(word: string, index?: number): void {
    const { currentState } = this.cashObject.wordsInResultLine;
    this.cashObject.wordsInResultLine.previousState = [...currentState];
    const indexToSplice = index === undefined ? currentState.length : index;
    currentState.splice(indexToSplice, 0, word);
    this.saveCashe();
  }

  public deleteWord(index: number): void {
    const { currentState } = this.cashObject.wordsInResultLine;
    this.cashObject.wordsInResultLine.previousState = [...currentState];
    currentState.splice(index, 1);
    this.saveCashe();
  }

  public nextSentence(): void {
    this.cashObject.filledSentenceNumber += 1;
    this.cleanWordsInresultLine();
    this.saveCashe();
  }

  public setOpacity(opacity: number): void {
    this.cashObject.wordsOpacity = opacity;
    this.saveCashe();
  }

  private cleanWordsInresultLine(): void {
    this.cashObject.wordsInResultLine = {
      currentState: [],
      previousState: [],
    };
  }

  private saveCashe(): void {
    localStorage.setItem("puzzleGameData", JSON.stringify(this.cashObject));
  }

  public getAssembledSentence(): string[] {
    return this.cashObject.wordsInResultLine.currentState;
  }
}
// const b = [
//   ...document.querySelector(".result-panel__line_active")?.children,
// ].map((item) => item.textContent.trim());
// const a = JSON.parse(localStorage.getItem("puzzleGameData")).wordsInResultLine
//   .currentState;
// String(a) === String(b);

// console.log(
//   JSON.parse(localStorage.getItem("puzzleGameData")).wordsInResultLine
//     .currentState,
// );
