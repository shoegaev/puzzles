import { SentenceData, RoundData, FullLevelData } from "../types/data-types";

export class Loader {
  fullLevelData: Promise<FullLevelData> | null;

  ImageUrl: Promise<string> | null;

  urlBegining: string;

  constructor() {
    this.fullLevelData = null;
    this.ImageUrl = null;

    this.urlBegining =
      "https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/";
  }

  public loadLevelData(levelNumber: string): void {
    const url = `${this.urlBegining}data/wordCollectionLevel${levelNumber}.json`;
    this.fullLevelData = fetch(url)
      .then((response: Response) => response.json())
      .then((data: FullLevelData) => data);
  }

  public loadImages(roundNumber: string): void {
    this.fullLevelData?.then((data) => {
      const imageName = data.rounds[Number(roundNumber) - 1].levelData.imageSrc;
      const url = `${this.urlBegining}images/${imageName}`;
      this.ImageUrl = fetch(url)
        .then((response: Response) => response.blob())
        .then((blob) => URL.createObjectURL(blob));
    });
  }
}
