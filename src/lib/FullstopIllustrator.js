// @ts-nocheck
import * as d3 from 'd3';

export default class FullstopIllustrator {

  static MAX_RADIUS = 5;
  static ELLIPSIS_STOP_RADIUS = 5;

  static getEllipsisRgba(opacity) {
    return `rgba(158, 158, 161, ${opacity})`;
  }

  constructor(ctx) {
    const canvas = ctx.canvas;
    this.canvasContext = ctx;
    this.canvasWidth = canvas.clientWidth;
    this.canvasHeight = canvas.clientHeight; 
  } 

  drawEllipsis() {
    const r = FullstopIllustrator.ELLIPSIS_STOP_RADIUS;
    const padding = r*3;
    const xCoord = this.xCentre();
    const yCoord = this.yCentre();
    const blinkSet = async () => {
      await this.fullStopBlink([xCoord - padding, yCoord]);
      await this.fullStopBlink(this.canvasCentre());
      await this.fullStopBlink([xCoord + padding, yCoord]);
      requestAnimationFrame(blinkSet);
    }
    blinkSet();
  }

  fullStopBlink(centreCoords) {
    let opacity = 0.4;
    const singleBlinkPromise = new Promise(resolve => {
      const darkenStop = () => {
        nextRender();
        if (opacity < 1) {
          opacity += 0.04;
          requestAnimationFrame(darkenStop);
        } else {
          requestAnimationFrame(brightenStop);
        }
      };
      const brightenStop = () => {
        nextRender();
        if (opacity > 0.4) {
          opacity -= 0.04;
          requestAnimationFrame(brightenStop);
        } else {
          resolve(true);
        }
      };
      const nextRender = () => {
        this.drawEllipsisStop(...centreCoords, opacity);
      };
      darkenStop();
    });
    return singleBlinkPromise;
  } 

  drawEllipsisStop(x, y, opacity) {
    const r = FullstopIllustrator.ELLIPSIS_STOP_RADIUS;
    this.canvasContext.clearRect(x - r, y - r, r*2, r*2);
    this.canvasContext.fillStyle = FullstopIllustrator.getEllipsisRgba(opacity);
    this.canvasContext.beginPath();
    this.canvasContext.arc(x, y, r, 0, 2 * Math.PI);
    this.canvasContext.fill();
  }

  drawFullStop(centre = this.canvasCentre(), radius = FullstopIllustrator.ELLIPSIS_STOP_RADIUS) {
    this.canvasContext.beginPath();
    this.canvasContext.arc(...centre, radius, 0, 2 * Math.PI);
    this.canvasContext.fill();
  }

  // fullStopDrop() {
  //   let step = 1;
  //   return new Promise(resolve => {
  //     const stepDown = () => {
  //       const stepRaius =  FullstopIllustrator.MAX_RADIUS * d3.easeCubicIn(step / 100);
  //       this.clearCanvas();
  //       this.drawFullStop(stepRaius);
  //       if (step < 100) {
  //         step += 0.25;
  //         requestAnimationFrame(stepDown);
  //       } else {
  //         resolve(true);
  //       }
  //     }
  //     stepDown();
  //   }); 
  // }

  // leaderAnimation() {
  //   let endDegree = 270;
  //   return new Promise(resolve => {
  //     const step = () => {
  //       this.canvasContext.beginPath();
  //       this.canvasContext.arc(
  //         ...this.canvasCentre()(), FullstopIllustrator.MAX_RADIUS, 
  //         degreesToRadians(270), degreesToRadians(endDegree)
  //       );
  //       this.canvasContext.lineTo(...this.canvasCentre()());
  //       this.canvasContext.fill();
  //       if (endDegree >= 270 && endDegree < 630) {
  //         endDegree += 1;
  //         requestAnimationFrame(step);
  //       } else {
  //         resolve(true);
  //       }
  //     }
  //     step();
  //   });
  // }

  // clearCanvas() {
  //   this.canvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  // }

  canvasCentre() {
    return [this.xCentre(), this.yCentre()];
  }

  xCentre() {
    return this.canvasWidth / 2;
  }

  yCentre() {
    return this.canvasHeight / 2;
  }
}

// const degreesToRadians = function(degrees) {
//   return degrees * Math.PI/180;
// }

// const pause = function(duration=1000) {
//   return new Promise(resolve => {
//     setTimeout(() => {
//       resolve(true);
//     }, duration);
//   }); 
// }