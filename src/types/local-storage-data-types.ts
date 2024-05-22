export interface LocalStorageData {
  level: number;
  round: number;
  filledSentenceNumber: number;
  wordsOpacity: number;
  wordsInResultLine: {
    currentState: string[];
    previousState: string[];
  };
}
