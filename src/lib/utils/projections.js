// @ts-nocheck
import { tenByTenArray } from "./base"; 
import { geoPath, geoMercator } from "d3";
const SEFIRAH_VIEW_SCALE = 2700000;

export function projectionsForChannels(channels, screenPx) {
  const projections = tenByTenArray();
  channels.forEach((geoJson, fromIndex) => {
    const lineFeatures = geoJson.features;
    lineFeatures.forEach((channel, toIndex) => {
      projections[fromIndex][toIndex] = projectionForChannel(channel, screenPx);
    });
  });
  return projections;
}

function projectionForChannel(channel, screenPx) {
  const projection = geoMercator();
  const channelCoordsGcs = channel.geometry.coordinates;
  const channelCoordsPx = channelCoordsGcs.map(c => projection(c)); 

  setChannelAsProjectionHorizion(projection, channelCoordsPx);
  
  const boundsFrameRatio = boundsToFrameRatio(channelCoordsPx, screenPx, 0.5);
  
  centreProjection(projection, geoPath().centroid(channel));
  translateProjection(projection, screenPx);
  scaleProjection(projection, boundsFrameRatio);

  return projection;
}

export function projectionForIlan(sefirot, screenPx) {
  const projection = geoMercator();
  const ilanBoundsGcs = geoPath().bounds(sefirot);
  const ilanBoundsPx = ilanBoundsGcs.map(c => projection(c));
  const boundsFrameRatio = boundsToFrameRatio(ilanBoundsPx, screenPx);
  
  centreProjection(projection, sefirot.features[6].geometry.coordinates);
  translateProjection(projection, screenPx);
  scaleProjection(projection, boundsFrameRatio);

  return projection;
}

export function projectionBaseForSefirah(screenPx) {
  const p = geoMercator();
  const { width, height } = screenPx;
  p.translate([width / 2, height / 2]).scale(SEFIRAH_VIEW_SCALE);
  return p;
}

function translateProjection(p, screenPx) {
  const { width, height } = screenPx;
  return p.translate([width / 2, height / 2]);
} 

function centreProjection(p, pointGscCoords) {
  return p.center(pointGscCoords);
}

function scaleProjection(p, scaleFactor) {
  return p.scale(p.scale() * scaleFactor);
}

function setChannelAsProjectionHorizion(p, channelCoordsPx) {
  const xDeltaPx = lineDeltaX(channelCoordsPx);  
  const yDeltaPx = lineDeltaY(channelCoordsPx);
  const isSouthBound = yDeltaPx > 0;
  const isEastBound = xDeltaPx > 0; 
  const cAngleDegrees = calcAngleOfRay(xDeltaPx, yDeltaPx, isSouthBound);
  const adjustmentFn = angleAdjustmentFunctionByDirection(isSouthBound, isEastBound);

  return p.angle(adjustmentFn(cAngleDegrees));
} 

function screenFramePx(screenPx, frameToScreenRatio) {
  const { width, height } = screenPx;
  return { 
    frameWidthPx: width * frameToScreenRatio,
    frameHeightPx: height * frameToScreenRatio
  }
}

function boundsToFrameRatio(bounds, screenPx, frameToScreenRatio = 0.5) {
  const { frameWidthPx, frameHeightPx } = screenFramePx(screenPx, frameToScreenRatio);
  const ratio = Math.min(
    frameWidthPx / Math.abs(lineDeltaX(bounds)),
    frameHeightPx / Math.abs(lineDeltaY(bounds))
  );
  return ratio;
}

function calcAngleOfRay(xDelta, yDelta, yDeltaIsPositive) {
  const oppositeDelta = yDeltaIsPositive ? xDelta : yDelta;
  const adjacentDelta = yDeltaIsPositive ? yDelta : xDelta;
  const angleInRadians = calcAngleUsingInverseTangent(oppositeDelta, adjacentDelta);
  return convertRadiansToDegrees(angleInRadians);
}

function calcAngleUsingInverseTangent(opposite, adjacent) {
  return Math.atan(opposite / adjacent);
}

function convertRadiansToDegrees(rad) {
  return rad * 180 / Math.PI;
}

function lineDeltaX(coordinates) {
  return coordinates[1][0] - coordinates[0][0];
}

function lineDeltaY(coordinates) {
  return coordinates[1][1] - coordinates[0][1];
}

function angleAdjustmentFunctionByDirection(isSouthBound, isEastBound) {
  let fn;
  if (isSouthBound) {
    fn = function(cAngle) { return 90 - cAngle };
  } else if (isEastBound) {
    fn = function(cAngle) { return cAngle };
  } else {
    fn = function(cAngle) { return cAngle - 180 };
  }
  return fn;
}
