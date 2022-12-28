import Konva from 'konva/lib/Core'
import { Circle } from "konva/lib/shapes/Circle";

export default class EllipsisPainter {

  static DOT_ATTRS = {
    radius: 10,
    opacity: 0.4, 
    colour: '#9E9EA1'
  }
  
  constructor(screen) {
    this.stage = new Konva.Stage({
			container: screen.el,
			width: screen.width,
			height: screen.height
		});
    this.layer = new Konva.Layer();
    this.collapsed = false;
  }

  anime() {
    const ellipsis = this.getEllipsis();

    this.layer.add(...ellipsis);
    this.stage.add(this.layer);

    this.incomingTextAnime(ellipsis);
    setTimeout(() => {
      this.collapseAnime(ellipsis);
    }, 10000)
  }

  collapseAnime(ellipsis) {
    const x = this.stage.width() / 2;
    const duration = 30;
    const easing = Konva.Easings.StrongEaseOut;
    ellipsis[0].to({
      x,
      duration,
      easing
    });
    ellipsis[2].to({
      x,
      duration,
      easing,
      onFinish: () => this.collapsed = true
    });
  }

  incomingTextAnime(ellipsis) {
    const duration = 0.25;
    const eDotFadeIn = (index) => {
      ellipsis[index].to({
        opacity: 1,
        duration,
        onFinish: () => eDotFadeOut(index)
      });
    }

    const eDotFadeOut = (index) => {
      ellipsis[index].to({
        opacity: EllipsisPainter.DOT_ATTRS.opacity,
        duration,
        onFinish: () => {
          if (index < ellipsis.length - 1) {
            eDotFadeIn(index + 1);
          } else if (!this.collapsed) {
            eDotFadeIn(0);
          }
        }
      });
    }

    eDotFadeIn(0);
  } 

  getEllipsis() {
    const xCentre = this.stage.width() / 2;
    const yCentre = this.stage.height() / 2;
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
}