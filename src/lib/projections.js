// @ts-nocheck
import * as d3 from 'd3';
const SEFIRAH_VIEW_SCALE = 2700000;
const BASE_PROJECTION_FN = d3.geoMercator;

export function newIlanProjection(sefirot, screenPx) {
  const p = BASE_PROJECTION_FN();
  const { width, height } = screenPx;
  p.center(sefirot.features[6].geometry.coordinates);
  p.fitSize([width, height], { 
      "type": "FeatureCollection", 
      "features": sefirot.features 
    }
  );
  p.translate([width / 2, height / 2]);
  p.scale(p.scale() / 1.5);
  return p;
}

export function newBaseSefirahProjection(screenPx) {
  const p = BASE_PROJECTION_FN();
  const { width, height } = screenPx;
  p.translate([width / 2, height / 2]);
  p.scale(SEFIRAH_VIEW_SCALE);
  return p;
}