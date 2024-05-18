import { ViewLoadable } from "../../../../util/viewLoadable";
import { ElementParametrs } from "../../../../types/view-types";
import { Loader } from "../../../../loader/loader";
import { ElementCreator } from "../../../../util/element-creator";

export class WordsPanelView extends ViewLoadable {
  constructor(params: ElementParametrs, appLoader: Loader) {
    super(params, appLoader);
    this.addInnerElementsParams();
    this.addInnerElements();
    this.fillPanel();
  }

  private addInnerElementsParams(): void {
    for (let i = 0; i < 10; i += 1) {
      this.innerElementsParams.push({
        tag: "div",
        cssClasses: ["words-panel__line", "line"],
      });
    }
    this.innerElementsParams[0].cssClasses.push("words-panel__line_active");
  }

  public fillPanel(): void {
    this.appLoader.fullData?.then((data) => {
      const lines = [...this.getHtmlElement().querySelectorAll(".line")];
      const sentences = data[0]?.map(
        (sentenceData) => sentenceData.textExample,
      );
      const imageUrl = data[1];
      if (sentences === undefined || imageUrl === null) {
        throw new Error("incorrect game data");
      }
      this.appLoader.currentSentences = sentences;
      sentences.forEach((sentence, sentenceIndex) => {
        const sentenceArr = sentence.split(" ");
        const lettersQuantity = sentenceArr.join("").length;
        const wordsQuantity = sentenceArr.length;
        let leftIndent = 0;

        sentenceArr.forEach((word) => {
          const itemParams: ElementParametrs = {
            tag: "div",
            cssClasses: ["item"],
          };
          const itemTextParams: ElementParametrs = {
            tag: "span",
            cssClasses: ["item__text"],
            textContent: word,
          };

          const item = new ElementCreator(itemParams);
          const itemText = new ElementCreator(itemTextParams);
          item.addInnerElements(itemText.getElement());
          lines[sentenceIndex].append(item.getElement());
          // (word.length * 100)/ lettersQuantity : ширина айтема в процентах от родительского
          //  контейнера если распределять ширину пропорционально кол-ву букв в слове
          // lettersQuantity / wordsQuantity - word.length : разница в кол-ве букв между текущим
          // словом, и средним кол-вом букв в словах предложения (<D>)
          // <D> * (100 / (2 * lettersQuantity)) : коэф. делающий айтемы с небольшими словами больше
          // а айтемы с большими словами меньше (в зависимости от <D>)
          const itemWidth =
            (word.length * 100) / lettersQuantity +
            (lettersQuantity / wordsQuantity - word.length) *
              (100 / (2 * lettersQuantity));
          item.getElement().style.width = `${itemWidth}%`;

          const itemImg = new Image();
          itemImg.className = "item__image";
          itemImg.src = imageUrl;
          itemImg.style.height = "1000%";
          // `${(100 / itemWidth) * 100}%` - ширина родительского контейнера айтема в процентах ширины айтема
          itemImg.style.width = `${(100 / itemWidth) * 100}%`;
          // вертикальное смещение в зависимости от номера предложения
          itemImg.style.top = `-${100 * sentenceIndex}%`;

          // горизонтальное смещение где:
          // left indent - сумма длинн айтемов находящихся
          // до текущего.(в процентах от длинны род. конт. айтема)
          itemImg.style.left = `-${(leftIndent / itemWidth) * 100}%`;
          item.addInnerElements(itemImg);
          leftIndent += itemWidth;
        });
      });
    });
  }
}
