// @ts-nocheck
import * as d3 from 'd3';

export default class WordIllustrator {

  static INITIAL_FONT_SIZE = 4000;
  static MAX_FONT_STEP_DELTA = 100;

  constructor(ctx) {
    const canvas = ctx.canvas;
    this.canvasContext = ctx;
    this.canvasWidth = canvas.clientWidth;
    this.canvasHeight = canvas.clientHeight; 

    this.currentWord = null;
  }

  fullStopDrop() {
    const maxRadius = 750;
    const maxRadiusStepDelta = 7;
    let radius = maxRadius;
    this.canvasContext.resetTransform();
    return new Promise(resolve => {
      const stepDown = () => {
        this.clearCanvas();
        this.drawFullStop(radius);
        if (radius > 5) {
          const nextRadiusStepDelta =  maxRadiusStepDelta * d3.easeExpOut(radius / maxRadius);
          radius -= nextRadiusStepDelta;
          requestAnimationFrame(stepDown);
        } else {
          resolve(true);
        }
      }
      stepDown();
    }); 
  }

  wordDrop(nextWord) {
    this.canvasContext.resetTransform();
    return new Promise(resolve => {
      const maxFontSizeDelta = WordIllustrator.MAX_FONT_STEP_DELTA;
      const maxFontSize = WordIllustrator.INITIAL_FONT_SIZE;
      let fontSize = maxFontSize;
      this.canvasContext.textAlign = 'center';
      this.canvasContext.textBaseline = 'middle'
  
      const stepDown = () => {
        this.canvasContext.font = `${fontSize}px EB Garamond`;
        this.clearCanvas()
        this.canvasContext.fillText(nextWord, ...this.canvasCentre());
      
        if (fontSize > 70) {
          const nextFontSizeDelta =  Math.round(maxFontSizeDelta * d3.easeSinOut(fontSize / maxFontSize));
          fontSize -= nextFontSizeDelta;
          requestAnimationFrame(stepDown);
        } else {
          resolve(true);
        }
      }
      stepDown();
    });
  }

  drawFullStop(radius) {
    this.canvasContext.beginPath();
    this.canvasContext.arc(...this.canvasCentre(), radius, 0, 2 * Math.PI);
    this.canvasContext.fill();
  }

  clearCanvas() {
    this.canvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  canvasCentre() {
    return [this.canvasWidth / 2, this.canvasHeight / 2];
  }
}