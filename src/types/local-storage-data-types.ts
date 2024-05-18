export interface LocalStorageData {
  level: number;
  round: number;
  filledSentenceNumber: number;
  wordsInResultLine: {
    currentState: string[];
    previousState: string[];
  }
}
