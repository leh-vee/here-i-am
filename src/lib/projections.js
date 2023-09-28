// @ts-nocheck
import * as d3 from 'd3';
const SEFIRAH_VIEW_SCALE = 2700000;
const BASE_PROJECTION_FN = d3.geoMercator;

export function newIlanProjection(sefirot, screenPx) {
  const projection = BASE_PROJECTION_FN();
  const coordIlanBounds = d3.geoPath().bounds(sefirot);
  const pxIlanBounds = coordIlanBounds.map(c => projection(c));
  
  const { frameWidthPx, frameHeightPx } = ilanFramePx(screenPx);
  const boundsFrameRatio = boundsToFrameRatio(pxIlanBounds, frameWidthPx, frameHeightPx)

  const { width, height } = screenPx;
  projection
    .center(sefirot.features[6].geometry.coordinates)
    .translate([width / 2, height / 2])
    .scale(projection.scale() * boundsFrameRatio);

  return projection;
}

function ilanFramePx(screenPx, frameToScreenRatio = 0.5) {
  const { width, height } = screenPx;
  return { 
    frameWidthPx: width * frameToScreenRatio,
    frameHeightPx: height * frameToScreenRatio
  }
}

function boundsToFrameRatio(bounds, fWidth, fHeight) {
  const ratio = Math.min(
    fWidth / Math.abs(bounds[1][0] - bounds[0][0]),
    fHeight / Math.abs(bounds[1][1] - bounds[0][1])
  );
  return ratio;
} 

export function newBaseSefirahProjection(screenPx) {
  const p = BASE_PROJECTION_FN();
  const { width, height } = screenPx;
  p.translate([width / 2, height / 2]);
  p.scale(SEFIRAH_VIEW_SCALE);
  return p;
}