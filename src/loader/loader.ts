import { SentenceData, RoundData, FullLevelData } from "../types/data-types";

export class Loader {
  fullLevelData: FullLevelData | null;

  currrentImagesUrls: string[];

  urlBegining: string;

  constructor() {
    this.fullLevelData = null;
    this.currrentImagesUrls = [];

    this.urlBegining =
      "https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/";
  }

  public loadLevelData(levelNumber: string): void {
    const url = `${this.urlBegining}data/wordCollectionLevel${levelNumber}.json`;
    fetch(url)
      .then((response: Response) => response.json())
      .then((data: FullLevelData) => {
        this.fullLevelData = data;
        return data;
      })
      .then((data) => {
        this.loadImages(data);
        console.log(this.currrentImagesUrls);
      });
  }

  public loadImages(data: FullLevelData): void {
    data.rounds.forEach((round) => {
      const imagePath = round.levelData.imageSrc;
      const url = `${this.urlBegining}images/${imagePath}`;
      this.currrentImagesUrls?.push(url);
    });
  }
}
