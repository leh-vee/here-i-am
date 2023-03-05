// @ts-nocheck
export default class VerseNumberIllustrator {

  static FONT_SIZE = 200;

  constructor(canvasEl) {
    this.canvasContext = canvasEl.getContext('2d');
    this.canvasWidth = this.canvasContext.canvas.clientWidth;
    this.canvasHeight = this.canvasContext.canvas.clientHeight;

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