// @ts-nocheck
import { fetchData } from './serverConfig.js';

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

export async function fetchPoemText() {
  const filePath = `${window.location.href}/poem.txt`;
  const response = await fetch(filePath);
  const text = await response.text();
  return text.split('\n').map(line => line.trim());
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