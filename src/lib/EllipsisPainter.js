import Konva from 'konva/lib/Core';
import { Circle } from "konva/lib/shapes/Circle";

export default class EllipsisPainter {

  static DOT_ATTRS = {
    radius: 5,
    opacity: 0.4, 
    colour: '#9E9EA1'
  }
  
  constructor(konvaLayer) {
    this.layer = konvaLayer;
    this.collapsed = false;
  }

  animate() {
    return new Promise(resolve => {
      const ellipsis = this.getEllipsis();
      this.layer.add(...ellipsis);
      this.incomingTextAnime(ellipsis);
      setTimeout(async () => {
        await this.collapseAnime(ellipsis);
        resolve(true);
      }, 5000); // delay before collapse
    });
  }

  collapseAnime(ellipsis) {
    return new Promise(resolve => {
      const x = this.layer.width() / 2;
      const duration = 1; // duration of collapse
      const easing = Konva.Easings.StrongEaseIn;
      ellipsis[0].to({
        x,
        duration,
        easing
      });
      ellipsis[2].to({
        x,
        duration,
        easing,
        onFinish: () => {
          this.collapsed = true;
          resolve(true);
        }
      });
    });
  }

  incomingTextAnime(ellipsis) {
    const duration = 0.25;
    const eDotFadeIn = (index) => {
      ellipsis[index].to({
        opacity: 1,
        duration,
        onFinish: () => {
          if (!this.collapsed) eDotFadeOut(index);
        }
      });
    }

    const eDotFadeOut = (index) => {
      ellipsis[index].to({
        opacity: EllipsisPainter.DOT_ATTRS.opacity,
        duration,
        onFinish: () => {
          if (index < ellipsis.length - 1) {
            eDotFadeIn(index + 1);
          } else {
            eDotFadeIn(0);
          }
        }
      });
    }

    eDotFadeIn(0);
  } 

  getEllipsis() {
    const xCentre = this.layer.width() / 2;
    const yCentre = this.layer.height() / 2;
    const dotDistance = EllipsisPainter.DOT_ATTRS.radius * 3;

    const ellipsis = [
      this.getDot('left', xCentre - dotDistance, yCentre),
      this.getDot('centre', xCentre, yCentre),
      this.getDot('right', xCentre + dotDistance, yCentre)
    ]
    return ellipsis;
  }

  getDot(id, x, y) {
    const { radius, colour: fill, opacity } = EllipsisPainter.DOT_ATTRS
    const newDot = new Circle(
      { name: 'dot', id, x, y, radius, fill, opacity }
    );
    return newDot;
  }

  clearCanvas() {
    this.layer.clear();
  }
}