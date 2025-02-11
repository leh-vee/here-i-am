// @ts-nocheck
import { fetchData } from './serverConfig.js';

export async function fetchSefirot() {
  const sefirotJson = await fetchData('street-nodes/tree-of-life');
  return JSON.parse(sefirotJson);
}

export async function fetchBlocksWithinRadius(centroidCoords, radiusKm) {
  const json = { centroidCoords, radiusKm }
  const blocksJson = await fetchData('street-edges/within-radius', 
    { method: "post", body: JSON.stringify(json) }, 10
  );
  return JSON.parse(blocksJson);
}

export async function fetchBlocksForProjection(projection, screenPx, forRotation=false) {
  const projectionCoords = projectionBoundingBoxCoords(projection, screenPx, forRotation);
  const blocksJson = await fetchProjectionBlocks(projectionCoords);
  return JSON.parse(blocksJson);
}

export function fetchPoemText() {
  const filePath = `${window.location.href}/poem.txt`;
  return getLinesFromTxtFile(filePath);
}

export function fetchIntroCouplets() {
  const filePath = `${window.location.href}/intro_couplets.txt`;
  return getLinesFromTxtFile(filePath);
}

export function fetchFaqText() {
  const filePath = `${window.location.href}/faq.txt`;
  return getLinesFromTxtFile(filePath);
}

async function getLinesFromTxtFile(filePath) {
  const response = await fetch(filePath);
  const text = await response.text();
  return text.split('\n').map(line => line.trim());
} 

async function fetchProjectionBlocks(projectionCoords) {
  return fetchData('street-edges/area', 
    { method: "post", body: JSON.stringify(projectionCoords) }
  );
}

function projectionBoundingBoxCoords(projection, screenPx, forRotation=false) {
  const  { width, height } = screenPx;
  let minCoordsPx = [0, 0];
  let maxCoordsPx = [width, height];
  if (forRotation) {
    if (height > width) {
      const halfMargin = (height - width) / 2;
      minCoordsPx = [-halfMargin, 0];
      maxCoordsPx = [width + halfMargin, height];
    } else {
      const halfMargin = (width - height) / 2;
      minCoordsPx = [0, -halfMargin];
      maxCoordsPx = [width, height + halfMargin];
    }
  }
  const minCoordsGsc = projection.invert(minCoordsPx);
  const maxCoordsGsc = projection.invert(maxCoordsPx);
  const coords = [...minCoordsGsc, ...maxCoordsGsc];
  return coords;
} 