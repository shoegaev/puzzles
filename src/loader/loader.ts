import { AppCashe } from "../app-cashe/app-cashe";
import { SentenceData, FullLevelData } from "../types/loader-data-types";
import { LoadingWindowView } from "./loading-window/loading-window";

export class Loader {
  appCashe: AppCashe;

  levelData: Promise<FullLevelData> | null;

  ImageUrl: Promise<string> | null;

  fullData: Promise<[SentenceData[] | undefined, string | null, string]> | null;

  fullDataNew: Promise<
    [SentenceData[] | undefined, string | null, string]
  > | null;

  urlBegining: string;

  currentSentences: string[];

  loadingWindowView: LoadingWindowView;

  controller: [AbortController] | [null];

  constructor(appCashe: AppCashe) {
    this.controller = [null];
    this.appCashe = appCashe;
    this.levelData = null;
    this.ImageUrl = null;
    this.fullData = null;
    this.fullDataNew = null;
    this.currentSentences = [];
    this.urlBegining =
      "https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/";
    this.loadingWindowView = new LoadingWindowView(this.controller);
  }

  public loadLevelData(levelNumber: string): Promise<FullLevelData> {
    const url = `${this.urlBegining}data/wordCollectionLevel${levelNumber}.json`;
    const controller = new AbortController();
    this.controller[0] = controller;
    const promise = fetch(url, { signal: controller.signal })
      .then((response: Response) => response.json())
      .then((data: FullLevelData) => data);
    this.levelData = promise;
    return promise;
  }

  public loadFullData(levelNumer: string, roundNumber: string): void {
    this.loadingWindowView.show();
    this.fullDataNew = this.loadLevelData(levelNumer)
      .then(() => {
        this.loadImages(roundNumber);
      })
      .then(
        () =>
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
    this.fullDataNew
      .then(() => {
        this.fullData = this.fullDataNew;
        this.fullDataNew = null;
        this.loadingWindowView.remove();
      })
      .catch((err: Error) => {
        this.errorHandler(err);
      });
  }

  public loadImages(roundNumber: string): void {
    this.levelData?.then((data) => {
      const imageName = data.rounds[Number(roundNumber) - 1].levelData.imageSrc;
      const url = `${this.urlBegining}images/${imageName}`;
      this.ImageUrl = fetch(url, { signal: this.controller[0]?.signal })
        .then((response: Response) => response.blob())
        .then((blob) => URL.createObjectURL(blob));
    });
  }

  public getCurrentSentence(): string[] {
    return this.currentSentences[
      this.appCashe.cashObject.filledSentenceNumber
    ].split(" ");
  }

  private errorHandler(err: Error): void {
    if (err.message === "Failed to fetch") {
      this.loadingWindowView.setErrorMessage("Error, you have connection problems");
    }
  }
}
