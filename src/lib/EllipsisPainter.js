import Konva from 'konva/lib/Core'
import { Circle } from "konva/lib/shapes/Circle";

export default class EllipsisPainter {

  static DOT_RADIUS = 30;
  
  constructor(screen) {
    this.stage = new Konva.Stage({
			container: screen.el,
			width: screen.width,
			height: screen.height
		});
    this.layer = new Konva.Layer();
  }

  agogsCollapseAnime() {
    const xCentre = this.stage.width() / 2;
    const yCentre = this.stage.height() / 2;
    const dotDistance = EllipsisPainter.DOT_RADIUS * 4; 

    this.layer.add(
      this.dot('centre', xCentre, yCentre),
      this.dot('left', xCentre - dotDistance, yCentre),
      this.dot('right', xCentre + dotDistance, yCentre)
    );
    this.stage.add(this.layer);
  }

  dot(id, x, y, radius = EllipsisPainter.DOT_RADIUS) {
    const newDot = new Circle({
      name: 'dot',
			fill: '#9E9EA1',
      id,
			x,
			y,
			radius
		});
    return newDot;
  }
}