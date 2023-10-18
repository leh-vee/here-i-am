// @ts-nocheck
import { writable, get, derived } from 'svelte/store';
import { fetchSefirot } from '../api/client.js';
import { channelFeatures } from '../lib/utils/geoJson.js';
import { projectionsForChannels } from '../lib/utils/projections.js';
import { tenByTenArray } from '../lib/utils/base.js';
import { lastPiSlice, currentPiSlice } from '../stores/text';

export const sefirotPoints = writable(undefined);
export const channelLines = writable(undefined);
export const channelProjections = writable(undefined);

function createChannelBlocksStore() {
  const { subscribe, update } = writable(tenByTenArray());

  return {
    subscribe,
    setForIndices: (fromIndex, toIndex, blocks) => update((channelBlocks) => {
      channelBlocks[fromIndex][toIndex] = blocks;
      return channelBlocks;
    })
  };
}
export const channelBlocks = createChannelBlocksStore();

export const currentChannelProjection = derived(
  [channelProjections], ([$channelProjections]) => {
    return $channelProjections[get(lastPiSlice)][get(currentPiSlice)];
  }
);

export const currentChannelLine = derived(
  [channelLines], ([$channelLines]) => {
    return $channelLines[get(lastPiSlice)].features[get(currentPiSlice)];
  }
);

export const currentChannelCoordsPx = derived(
  [currentChannelProjection, currentChannelLine], 
  ([$currentChannelProjection, $currentChannelLine]) => {
    const chCoordsGsc = $currentChannelLine.geometry.coordinates;
    const chCoordsPx = chCoordsGsc.map(cGsc => {
      const coordsPx = $currentChannelProjection(cGsc);
      const roundCoordsPx = coordsPx.map(coord => Math.round(coord));
      return roundCoordsPx;
    });
    return chCoordsPx;
  }
);

export async function setIlanData(screenPx) {
  const sefirotGeoJson = await fetchSefirot();
  sefirotPoints.set(sefirotGeoJson);
  const channelLinesGeoJson = channelFeatures(sefirotGeoJson);
  channelLines.set(channelLinesGeoJson);
  channelProjections.set(projectionsForChannels(channelLinesGeoJson, screenPx));
}