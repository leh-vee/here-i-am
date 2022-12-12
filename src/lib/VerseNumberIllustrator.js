// @ts-nocheck
export default class VerseNumberIllustrator {

  static FONT_SIZE = 400;

  constructor(ctx) {
    const canvas = ctx.canvas;
    this.canvasContext = ctx;
    this.canvasWidth = canvas.clientWidth;
    this.canvasHeight = canvas.clientHeight;

    const fontSize = VerseNumberIllustrator.FONT_SIZE;
    this.canvasContext.font = `${fontSize}px Source Code Pro`;
    this.canvasContext.textAlign = 'center';
    this.canvasContext.textBaseline = 'middle'
  }

  showNumber(number) {
    this.canvasContext.fillText(number, ...this.canvasCentre());
  };

  clearCanvas() {
    this.canvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  canvasCentre() {
    return [this.canvasWidth / 2, this.canvasHeight / 2];
  }
}