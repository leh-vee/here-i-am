// @ts-nocheck
import { fetchData } from './interface.js';

export async function fetchSefirot() {
  const sefirotJson = await fetchData('street-nodes/tree-of-life');
  return JSON.parse(sefirotJson);
}

export async function fetchBlocksForProjection(projection) {
  const projectionCoords = projectionBoundingBoxCoords(projection);
  const blocksJson = await fetchProjectionBlocks(projectionCoords);
  return JSON.parse(blocksJson);
}

export async function fetchBlocksForSefirotProjections(sefirot, projection) {
  const blocks = [];
  for (let i = 0; i < 10; i++) {
    projection.center(sefirot.features[i].geometry.coordinates);
    let projectionCoords = projectionBoundingBoxCoords(projection);
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

function projectionBoundingBoxCoords(projection) {
  const pWidth = projection.translate()[0] * 2;
  const pHeight = projection.translate()[1] * 2;
  const minCoords = projection.invert([0, 0]);
  const maxCoords = projection.invert([pWidth, pHeight]);
  const coords = [...minCoords, ...maxCoords];
  return coords;
} 