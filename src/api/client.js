// @ts-nocheck
import { fetchData } from './interface.js';

export async function fetchSefirot() {
  const sefirotJson = await fetchData('street-nodes/tree-of-life');
  return JSON.parse(sefirotJson);
}

export async function fetchBlocksForProjection(projection, screenPx) {
  const projectionCoords = projectionBoundingBoxCoords(projection, screenPx);
  const blocksJson = await fetchProjectionBlocks(projectionCoords);
  return JSON.parse(blocksJson);
}

export async function fetchBlocksForSefirotProjections(sefirot, projection, screenPx) {
  const blocks = [];
  for (let i = 0; i < 10; i++) {
    projection.center(sefirot.features[i].geometry.coordinates);
    let projectionCoords = projectionBoundingBoxCoords(projection, screenPx);
    fetchProjectionBlocks(projectionCoords).then(blocksJson => {
      blocks[i] = JSON.parse(blocksJson);
    });
  };
  return blocks;
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