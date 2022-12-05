// @ts-nocheck
import * as d3 from 'd3';

export default class FullstopIllustrator {

  constructor(ctx) {
    const canvas = ctx.canvas;
    this.canvasContext = ctx;
    this.canvasWidth = canvas.clientWidth;
    this.canvasHeight = canvas.clientHeight; 
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