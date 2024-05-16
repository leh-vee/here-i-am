// @ts-nocheck
import { tenByTenArray } from "./base"; 
import { geoPath, geoMercator } from "d3";

export function projectionsForChannels(channels, screenPx) {
  const projections = tenByTenArray();
  channels.forEach((geoJson, fromIndex) => {
    const lineFeatures = geoJson.features;
    lineFeatures.forEach((channel, toIndex) => {
      if (fromIndex !== toIndex) {
        projections[fromIndex][toIndex] = projectionForChannel(channel, screenPx);
      } 
    });
  });
  return projections;
}

function projectionForChannel(channel, screenPx) {
  const projection = geoMercator();
  const channelCoordsGcs = channel.geometry.coordinates;
  let channelCoordsPx = channelCoordsGcs.map(c => projection(c)); 
  setChannelAsProjectionHorizion(projection, channelCoordsPx);
  
  channelCoordsPx = channelCoordsGcs.map(c => projection(c));
  const boundsFrameRatio = boundsToFrameRatio(channelCoordsPx, screenPx, 0.9);
  
  const { width, height } = screenPx;
  projection.center(geoPath().centroid(channel));
  projection.translate([width / 2, height / 1.7]);
  scaleProjection(projection, boundsFrameRatio);

  return projection;
}

export function projectionForIlan(sefirot, screenPx) {
  const projection = geoMercator();
  const ilanBoundsGcs = geoPath().bounds(sefirot);
  const ilanBoundsPx = ilanBoundsGcs.map(c => projection(c));
  const boundsFrameRatio = boundsToFrameRatio(ilanBoundsPx, screenPx);
  
  const { width, height } = screenPx;
  projection.center(sefirot.features[6].geometry.coordinates);
  projection.translate([width / 2, height / 2]);
  scaleProjection(projection, boundsFrameRatio);

  return projection;
}

export function projectionForLandingPage(sefirot, screenPx) {
  const projection = projectionForIlan(sefirot, screenPx);
  projection.center(sefirot.features[0].geometry.coordinates)
  projection.scale(projection.scale() * 0.4);
  return projection;
}

export function projectionForSefirah(sefirah, screenPx) {
  const sefirahScale = 1800000;
  const p = geoMercator();
  const { width, height } = screenPx;
  p.translate([width / 2, height / 2]).scale(sefirahScale);
  p.center(sefirah.geometry.coordinates);
  return p;
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
