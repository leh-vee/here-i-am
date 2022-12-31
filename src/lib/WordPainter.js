// @ts-nocheck
import * as d3 from 'd3';
import { timeThursdays } from 'd3';

export default class WordPainter {

  static INITIAL_FONT_SIZE = 4000;
  static MAX_FONT_STEP_DELTA = 100;

  constructor(canvasEl) {
    this.canvasContext = canvasEl.getContext('2d');
    this.canvasWidth = this.canvasContext.canvas.clientWidth;
    this.canvasHeight = this.canvasContext.canvas.clientHeight;
    
    this.textClipCanvas = canvasEl.cloneNode(true).getContext('2d');
    this.textShadowCanvas = canvasEl.cloneNode(true).getContext('2d');
  }

  simpleText(text) {
    this.canvasContext.textAlign = 'center';
    this.canvasContext.textBaseline = 'middle'
    this.canvasContext.font = "50px EB Garamond";
    this.canvasContext.strokeStyle = '#9E9EA1';
    this.canvasContext.fillStyle = "black";
    this.canvasContext.lineWidth = 2;
    this.canvasContext.fillText(text, (this.canvasWidth / 2) - 10, (this.canvasHeight / 2) - 50);
    // this.canvasContext.strokeText(text, this.canvasWidth / 2, (this.canvasHeight / 2) - 50);
    // this.canvasContext.strokeText(text, ...this.canvasCentre());
  }

  blendAnime(text, streetCanvas) {
    // this.textClipCanvas.textAlign = 'center';
    // this.textClipCanvas.textBaseline = 'middle'
    // this.textClipCanvas.font = "400px EB Garamond";
    // this.textClipCanvas.fillText(text, ...this.canvasCentre());

    this.textShadowCanvas.textAlign = 'center';
    this.textShadowCanvas.textBaseline = 'middle'
    this.textShadowCanvas.font = "400px EB Garamond";
    this.textShadowCanvas.fillText(text, ...this.canvasCentre());
    this.textShadowCanvas.globalCompositeOperation = "source-out";
    this.textShadowCanvas.fillStyle = "black";
    this.textShadowCanvas.fillRect(0, 350, this.canvasWidth, this.canvasHeight - 650);

    // this.canvasContext.drawImage(this.textClipCanvas.canvas, 0, 0);
    // this.canvasContext.globalCompositeOperation = "source-in";
    // this.canvasContext.drawImage(streetCanvas, 0, 0);
    // this.canvasContext.globalCompositeOperation = "source-over";
    this.canvasContext.drawImage(this.textShadowCanvas.canvas, 0, 0);

    // this.canvasContext.globalCompositeOperation = "source-over";
    // this.canvasContext.textAlign = 'center';
    // this.canvasContext.textBaseline = 'middle'
    // this.canvasContext.font = "400px EB Garamond";
    // this.canvasContext.strokeStyle = '#9E9EA1';
    // this.canvasContext.strokeText(text, ...this.canvasCentre());
  }

  clipAnime(text) {
    const ctx = this.canvasContext;
    let circlePath = new Path2D();
    circlePath.arc(150, 75, 75, 0, 2 * Math.PI);
    let squarePath = new Path2D();
    squarePath.rect(85, 10, 130, 130);
    let textPath = new Path2D();
    textPath.text(text, ...this.canvasCentre());

    ctx.clip(circlePath);
    // ctx.clip(squarePath);

    // Draw stuff that gets clipped
    ctx.fillStyle = 'blue';
    ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    // const fontSize = 140;
    // this.canvasContext.textAlign = 'center';
    // this.canvasContext.textBaseline = 'middle'
    // this.canvasContext.font = `${fontSize}px EB Garamond`;
    // const textClipPath = new Path2D().strokeText(text, ...this.canvasCentre());
    
    // const squareClipPath = new Path2D().rect(0, 0, 10, 10);
    // this.canvasContext.clip(squareClipPath);
    // this.canvasContext.fillRect(0, 0, 100, 100);

    // const circleClipPath = new Path2D().arc(this.canvasWidth / 2, this.canvasHeight / 2, 10, 0, 2 * Math.PI);
    // this.canvasContext.fillRect(0, 0, this.canvasWidth , this.canvasHeight);
  } 

  wordDrop(nextWord) {
    // this.canvasContext.resetTransform();
    this.canvasContext.strokeStyle = '#9E9EA1';
    this.canvasContext.fillStyle = "white";
    this.canvasContext.lineWidth = 2;
    return new Promise(resolve => {
      const maxFontSizeDelta = WordPainter.MAX_FONT_STEP_DELTA;
      const maxFontSize = WordPainter.INITIAL_FONT_SIZE;
      let fontSize = 0;
      this.canvasContext.textAlign = 'center';
      this.canvasContext.textBaseline = 'middle'
  
      const stepUp = () => {
        this.clearCanvas();
        this.canvasContext.font = `${fontSize}px EB Garamond`;
        this.canvasContext.fillText(nextWord, ...this.canvasCentre());
        this.canvasContext.strokeText(nextWord, ...this.canvasCentre());
      
        if (fontSize < 400) {
          // const nextFontSizeDelta =  Math.round(maxFontSizeDelta * d3.easeSinOut(fontSize / maxFontSize));
          fontSize += 1;
          requestAnimationFrame(stepUp);
        } else {
          requestAnimationFrame(stepDown);
        }
      }
      const stepDown = () => {
        this.clearCanvas();
        this.canvasContext.font = `${fontSize}px EB Garamond`;
        this.canvasContext.fillText(nextWord, ...this.canvasCentre());
        this.canvasContext.strokeText(nextWord, ...this.canvasCentre());
        if (fontSize > 0) {
          fontSize -= 1;
          requestAnimationFrame(stepDown)
        } else {
          resolve(true);
        }
      }
      stepUp();
    });
  }

  clearCanvas() {
    this.canvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  canvasCentre() {
    return [this.canvasWidth / 2, this.canvasHeight / 2];
  }
}