// @ts-nocheck
import { fetchData } from './interface.js';

export async function fetchSefirot() {
  const sefirotJson = await fetchData('street-nodes/tree-of-life');
  console.log('sefirot locations fetched');
  return JSON.parse(sefirotJson);
}

export async function fetchBlocksWithinRadius(centroidCoords, radiusKm) {
  const json = { centroidCoords, radiusKm }
  const blocksJson = await fetchData('street-edges/within-radius', 
    { method: "post", body: JSON.stringify(json) }
  );
  return JSON.parse(blocksJson);
}

export async function fetchBlocksForProjection(projection, screenPx) {
  const projectionCoords = projectionBoundingBoxCoords(projection, screenPx);
  const blocksJson = await fetchProjectionBlocks(projectionCoords);
  return JSON.parse(blocksJson);
}

async function fetchProjectionBlocks(projectionCoords) {
  return fetchData('street-edges/area', 
    { method: "post", body: JSON.stringify(projectionCoords) }
  );
}

function projectionBoundingBoxCoords(projection, screenPx) {
  const  { width, height } = screenPx;
  const minCoords = projection.invert([0, 0]);
  const maxCoords = projection.invert([width, height]);
  const coords = [...minCoords, ...maxCoords];
  return coords;
} 

function channelProjectionBoundingBoxCoords(projection, screenPx) {
  const  { width, height } = screenPx;
  const topLeftCoordsGsc = projection.invert([0, 0]);
  const bottomRightCoordsGsc = projection.invert([width, height]);
  const xMinCoordGsc = Math.min(topLeftCoordsGsc[0], bottomRightCoordsGsc[0]);
  const xMaxCoordGsc = Math.max(topLeftCoordsGsc[0], bottomRightCoordsGsc[0]);
  const yMinCoordGsc = Math.min(topLeftCoordsGsc[1], bottomRightCoordsGsc[1]);
  const yMaxCoordGsc = Math.max(topLeftCoordsGsc[1], bottomRightCoordsGsc[1]);
  const minCoordsGsc = [xMinCoordGsc, yMinCoordGsc]; 
  const maxCoordsGsc = [xMaxCoordGsc, yMaxCoordGsc];
  const coords = [...minCoordsGsc, ...maxCoordsGsc];

  return coords;
}