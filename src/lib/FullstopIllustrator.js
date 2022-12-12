// @ts-nocheck
import * as d3 from 'd3';

export default class FullstopIllustrator {

  constructor(ctx) {
    const canvas = ctx.canvas;
    this.canvasContext = ctx;
    this.canvasWidth = canvas.clientWidth;
    this.canvasHeight = canvas.clientHeight; 
  } 

  async ellipsisAnimation(delay=2000) {
    await this.fullStopDrop();
    await pause(delay);
    await this.fullStopDrop();
    await pause(delay);
    return this.fullStopDrop();
  }

  fullStopDrop() {
    const maxRadius = 750;
    const maxRadiusStepDelta = 7;
    let radius = maxRadius;
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

const pause = function(duration=1000) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, duration);
  }); 
}