import { geoPath } from "d3";
import { Image } from "konva/lib/shapes/Image";

const LINE_WIDTH = 1;
const LINE_COLOUR = '#9E9EA1';

export function renderBlocksAsBackground(konvaLayer, projection, blocks) {
  const canvas = configBackgroundCanvas(konvaLayer);
  const ctx = configCanvasContext(canvas);
  const geoGenerator = geoGenForProjectionCtx(projection, ctx);
  
  ctx.beginPath();
  geoGenerator({type: 'FeatureCollection', features: blocks.features})
  ctx.stroke();
}

function configBackgroundCanvas(kLayer) {
  const canvas = document.createElement('canvas');
  canvas.width = kLayer.width();
  canvas.height = kLayer.height();
  
  const centrelineImage = new Image({ image: canvas });
  centrelineImage.opacity(1); // do I need this line?
  kLayer.add(centrelineImage);

  return canvas;
}

function configCanvasContext(canvas) {
  const ctx = canvas.getContext('2d');
  ctx.lineWidth = LINE_WIDTH;
  ctx.strokeStyle = LINE_COLOUR;
  return ctx;
}

function geoGenForProjectionCtx(p, ctx) {
  return geoPath().projection(p).context(ctx);
}