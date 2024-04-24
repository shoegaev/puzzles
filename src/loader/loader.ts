import { SentenceData, RoundData, FullLevelData } from "../types/data-types";

export class Loader {
  levelData: Promise<FullLevelData> | null;

  ImageUrl: Promise<string> | null;

  fullData: Promise<[SentenceData[] | undefined, string | null, string]> | null;

  urlBegining: string;

  constructor() {
    this.levelData = null;
    this.ImageUrl = null;
    this.fullData = null;
    this.urlBegining =
      "https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/";
  }

  public loadLevelData(levelNumber: string): Promise<FullLevelData> {
    const url = `${this.urlBegining}data/wordCollectionLevel${levelNumber}.json`;
    const promise = fetch(url)
      .then((response: Response) => response.json())
      .then((data: FullLevelData) => data);
    this.levelData = promise;
    return promise;
  }

  public loadFullData(levelNumer: string, roundNumber: string): void {
    this.fullData = this.loadLevelData(levelNumer)
      .then(() => {
        this.loadImages(roundNumber);
      })
      .then(() =>
        // eslint-disable-next-line
        Promise.all([
          this.levelData?.then(
            (levelData) => levelData.rounds[Number(roundNumber) - 1].words,
          ),
          this.ImageUrl,
          "место для информации об аудио",
        ]),
        // eslint-disable-next-line
      );
  }

  public loadImages(roundNumber: string): void {
    this.levelData?.then((data) => {
      const imageName = data.rounds[Number(roundNumber) - 1].levelData.imageSrc;
      const url = `${this.urlBegining}images/${imageName}`;
      this.ImageUrl = fetch(url)
        .then((response: Response) => response.blob())
        .then((blob) => URL.createObjectURL(blob));
    });
  }
}
