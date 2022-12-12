// @ts-nocheck
import * as d3 from 'd3';

export default class FullstopIllustrator {

  static MAX_RADIUS = 750;

  constructor(ctx) {
    const canvas = ctx.canvas;
    this.canvasContext = ctx;
    this.canvasWidth = canvas.clientWidth;
    this.canvasHeight = canvas.clientHeight; 
  } 

  async ellipsisAnimation(delay=Math.PI*200) {
    // await this.fullStopDrop();
    // await pause(delay);
    // await this.fullStopDrop();
    // await pause(delay);
    return this.fullStopDrop();
  }

  fullStopDrop() {
    let step = 100;
    return new Promise(resolve => {
      const stepDown = () => {
        const stepRaius =  FullstopIllustrator.MAX_RADIUS * d3.easeBounceIn(step / 100);
        this.clearCanvas();
        this.drawFullStop(stepRaius);
        if (step > 1) {
          step -= 0.25;
          requestAnimationFrame(stepDown);
        } else {
          resolve(true);
        }
      }
      stepDown();
    }); 
  }

  leaderAnimation() {
    let endDegree = 270;
    return new Promise(resolve => {
      const step = () => {
        this.canvasContext.beginPath();
        this.canvasContext.arc(
          ...this.canvasCentre(), FullstopIllustrator.MAX_RADIUS, 
          degreesToRadians(270), degreesToRadians(endDegree)
        );
        this.canvasContext.lineTo(...this.canvasCentre());
        this.canvasContext.fill();
        if (endDegree >= 270 && endDegree < 630) {
          endDegree += 0.5;
          requestAnimationFrame(step);
        } else {
          resolve(true);
        }
      }
      step();
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

const degreesToRadians = function(degrees) {
  return degrees * Math.PI/180;
}

const pause = function(duration=1000) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, duration);
  }); 
}