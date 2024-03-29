export interface SentenceData {
  id: number;
  audioExmple: string;
  textExample: string;
  textExampleTranslate: string;
}
export interface RoundData {
  levelData: {
    id: string;
    name: string;
    imageSrc: string;
    author: string;
  };
  words: SentenceData[];
}
export interface FullLevelData {
  rounds: RoundData[];
  roundsCount: number;
}
